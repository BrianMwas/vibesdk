/**
 * Helpers for the per-app custom domain feature (Cloudflare for SaaS Custom
 * Hostnames). Requires a one-time manual zone setup — see
 * docs/custom-domains-setup.md — recorded as env.CUSTOM_DOMAIN_ZONE_ID.
 */

import { CloudflareAPI } from '../deployer/api/cloudflare-api';
import { CloudflareCustomHostname } from '../deployer/types';
import { getPreviewDomain } from '../../utils/urls';

export type CustomDomainStatus = 'pending' | 'active' | 'failed';

/** Builds a CloudflareAPI client scoped to the platform's own account + custom-domain zone. */
export function buildPlatformCloudflareApi(env: Env): CloudflareAPI {
    return new CloudflareAPI(env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN, env.CUSTOM_DOMAIN_ZONE_ID);
}

/** The CNAME target end users point their domain at. */
export function getFallbackOriginHostname(env: Env): string {
    return `fallback.${getPreviewDomain(env)}`;
}

const HOSTNAME_REGEX = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/;
const IP_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

/**
 * Validates a user-supplied custom domain. Rejects IPs, bare apex domains
 * (v1 scope — see plan), and the platform's own domains (to prevent hijacking
 * platform routing).
 */
export function isValidCustomHostname(hostname: string, env: Env): { valid: true } | { valid: false; reason: string } {
    if (!hostname || hostname.length > 253) {
        return { valid: false, reason: 'Invalid domain' };
    }
    if (IP_REGEX.test(hostname)) {
        return { valid: false, reason: 'IP addresses are not supported as custom domains' };
    }
    if (!HOSTNAME_REGEX.test(hostname)) {
        return { valid: false, reason: 'Invalid domain format' };
    }
    const labelCount = hostname.split('.').length;
    if (labelCount < 3) {
        // e.g. "example.com" (apex) is rejected; "app.example.com" is accepted.
        return { valid: false, reason: 'Apex/root domains are not supported yet — use a subdomain (e.g. app.example.com)' };
    }
    const previewDomain = getPreviewDomain(env);
    const platformDomains = [env.CUSTOM_DOMAIN, previewDomain].filter(Boolean).map((d) => d.toLowerCase());
    if (platformDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
        return { valid: false, reason: 'This domain is reserved by the platform' };
    }
    return { valid: true };
}

/**
 * Maps Cloudflare's custom-hostname + SSL state into our simplified 3-state
 * status, surfacing the clearest available error message on failure.
 */
export function mapCloudflareHostnameStatus(hostname: CloudflareCustomHostname): { status: CustomDomainStatus; error: string | null } {
    const terminalFailureStates: string[] = ['blocked', 'deleted'];
    const terminalSslFailureStates: string[] = [
        'initializing_timed_out',
        'validation_timed_out',
        'issuance_timed_out',
        'deployment_timed_out',
        'deletion_timed_out',
        'expired',
    ];

    if (terminalFailureStates.includes(hostname.status) || terminalSslFailureStates.includes(hostname.ssl.status)) {
        const error =
            hostname.verification_errors?.[0] ??
            hostname.ssl.validation_errors?.[0]?.message ??
            'Domain verification failed';
        return { status: 'failed', error };
    }

    if (hostname.status === 'active' && hostname.ssl.status === 'active') {
        return { status: 'active', error: null };
    }

    return { status: 'pending', error: null };
}
