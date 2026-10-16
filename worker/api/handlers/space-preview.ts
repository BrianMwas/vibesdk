import {
	buildHostPreviewCookie,
	buildPreviewCookie,
	EMBEDDED_PREVIEW_TOKEN_TTL_SECONDS,
	readPreviewCookie,
	verifyHostPreviewToken,
	verifySpacePreviewToken,
	type SpacePreviewClaims,
} from '../../utils/spacePreviewToken';
import { isSeparatePreviewDomain } from '../../utils/urls';
import { AppService } from '../../database/services/AppService';
import { RateLimitService } from '../../services/rate-limit/rateLimits';
import { getGlobalConfigurableSettings } from '../../config';
import { RateLimitExceededError } from 'shared/types/errors';
import { JWTUtils } from '../../utils/jwtUtils';

/**
 * Tells SpaceDO the preview is served at the root of its own host, so it must
 * not prefix root-relative links with the path-preview mount. Set only here,
 * after any copy the visitor sent is removed.
 */
export const PREVIEW_MOUNT_HEADER = 'X-Space-Preview-Mount';

const SPACE_PREVIEW_ROUTE_PATTERN = /^\/space\/([^/]+)\/preview\/([^/]+)(?:\/.*)?$/;

type SpaceNamespace = {
	SPACE_DO?: DurableObjectNamespace;
};

export interface SpacePreviewParams {
	spaceName: string;
	branch: string;
}

export function matchSpacePreviewParams(pathname: string): SpacePreviewParams | null {
	const match = pathname.match(SPACE_PREVIEW_ROUTE_PATTERN);
	if (!match) return null;
	return {
		spaceName: decodeURIComponent(match[1]),
		branch: decodeURIComponent(match[2]),
	};
}

function getSpaceNamespace(env: Env): DurableObjectNamespace | null {
	const spaceNamespace = (env as unknown as SpaceNamespace).SPACE_DO;
	return spaceNamespace ?? null;
}

async function forwardToSpacePreview(
	request: Request,
	env: Env,
	spaceName: string,
	rootOf?: { branch: string },
): Promise<Response> {
	const namespace = getSpaceNamespace(env);
	if (!namespace) {
		return new Response('Preview unavailable', { status: 404 });
	}
	// Strip `?t=` so the generated app never sees the token.
	const forwardedUrl = new URL(request.url);
	forwardedUrl.searchParams.delete('t');
	if (rootOf) {
		forwardedUrl.pathname = `/space/${encodeURIComponent(spaceName)}/preview/${encodeURIComponent(rootOf.branch)}${forwardedUrl.pathname}`;
	}
	const forwardedRequest = new Request(forwardedUrl.toString(), request);
	forwardedRequest.headers.delete(PREVIEW_MOUNT_HEADER);
	if (rootOf) forwardedRequest.headers.set(PREVIEW_MOUNT_HEADER, 'root');
	const stub = namespace.get(namespace.idFromName(spaceName));
	try {
		return await stub.fetch(forwardedRequest);
	} catch (e) {
		// A SpaceDO failure (e.g. no deployment yet, or a build error in the
		// generated app) must not escape as an unhandled exception — that
		// surfaces in dev as a miniflare "Unexpected end of JSON input" flood.
		// Return a graceful 503 the preview iframe can display instead.
		const message = e instanceof Error ? e.message : String(e);
		return new Response(
			`Preview not ready: ${message}. Deploy the app, then reload.`,
			{ status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
		);
	}
}

export function createPreviewAccessResponse(status: 401 | 403 | 429, title: string, message: string): Response {
	return new Response(
		`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><style>body{margin:0;font-family:Inter,system-ui,sans-serif;background:#0b1020;color:#e5e7eb;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}.card{max-width:480px;background:#111827;border:1px solid #374151;border-radius:12px;padding:24px;box-shadow:0 20px 45px rgba(0,0,0,.35)}h1{margin:0 0 12px;font-size:24px}p{margin:0;color:#cbd5e1;line-height:1.5}</style></head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`,
		{
			status,
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
			},
		},
	);
}

function isWebSocketResponse(response: Response): boolean {
	return response.status === 101 || response.headers.get('Upgrade')?.toLowerCase() === 'websocket';
}

/**
 * Confirm the token's embedded `previewVersion` still matches the app's current
 * value. A visibility toggle bumps `previewVersion` (see AppService), so a token
 * minted while public is rejected after a public->private toggle. Read from the
 * primary DB (no cache) for ~1s revocation. `spaceName === appId`.
 */
async function isPreviewVersionCurrent(
	env: Env,
	spaceName: string,
	claims: SpacePreviewClaims,
): Promise<boolean> {
	const current = (await new AppService(env).getPreviewVersion(spaceName)) ?? 0;
	return current === claims.previewVersion;
}

/**
 * Enforce a per-preview-token rate limit. SpaceDO previews are dispatched
 * outside the Hono chain, so the global API limiter does not apply here.
 * Returns a `429` Response when the limit is exceeded, otherwise `null`.
 * The limiter is keyed by a hash of the token (never the raw token).
 */
async function enforcePreviewRateLimit(
	env: Env,
	token: string,
	request: Request,
): Promise<Response | null> {
	try {
		const config = await getGlobalConfigurableSettings(env);
		const tokenId = await JWTUtils.getInstance(env).hashToken(token);
		await RateLimitService.enforceSpacePreviewRateLimit(env, config.security.rateLimit, tokenId, request);
		return null;
	} catch (error) {
		if (error instanceof RateLimitExceededError) {
			return createPreviewAccessResponse(429, 'Too many requests', 'This preview is receiving too many requests. Please slow down and try again shortly.');
		}
		// Fail open on unexpected limiter errors — do not block a legit preview.
		return null;
	}
}

/**
 * Unified, token-only preview auth. A request is authorized if it carries a
 * valid path/branch-scoped preview cookie, or a valid `?t=` token (which then
 * bootstraps the cookie). No session cookie / DB ownership check (claims-only),
 * but the token's `previewVersion` must still match the app's current epoch.
 */
export async function handleSpacePreview(
	request: Request,
	env: Env,
	spaceName: string,
	branch: string,
): Promise<Response> {
	const url = new URL(request.url);
	const crossSite = isSeparatePreviewDomain(env);
	const secure = url.protocol === 'https:';

	// 1. Existing preview cookie (covers iframe sub-resources / client fetches).
	const cookieToken = readPreviewCookie(request);
	if (cookieToken) {
		const claims = await verifySpacePreviewToken(env, cookieToken, spaceName, branch);
		if (claims && (await isPreviewVersionCurrent(env, spaceName, claims))) {
			const limited = await enforcePreviewRateLimit(env, cookieToken, request);
			if (limited) return limited;
			return forwardToSpacePreview(request, env, spaceName);
		}
	}

	// 2. `?t=` token: forward and bootstrap the cookie (serve-in-place).
	const queryToken = url.searchParams.get('t') ?? '';
	if (queryToken) {
		const claims = await verifySpacePreviewToken(env, queryToken, spaceName, branch);
		if (claims && (await isPreviewVersionCurrent(env, spaceName, claims))) {
			const limited = await enforcePreviewRateLimit(env, queryToken, request);
			if (limited) return limited;
			const response = await forwardToSpacePreview(request, env, spaceName);
			if (isWebSocketResponse(response)) {
				return response;
			}
			const withCookie = new Response(response.body, response);
			withCookie.headers.append(
				'Set-Cookie',
				buildPreviewCookie({ token: queryToken, spaceName, branch, crossSite, secure }),
			);
			return withCookie;
		}
	}

	if (queryToken || cookieToken) {
		return createPreviewAccessResponse(401, 'Access denied', 'This preview link is invalid or has expired.');
	}
	return createPreviewAccessResponse(401, 'Access denied', 'This preview link is missing an access token.');
}

/**
 * A preview served at the root of its own subdomain (an embedded site's
 * `<deploymentName>-preview` host). The token names the space and branch and
 * is bound to this host. Returns null when the request carries no token for
 * this host, so the caller can serve the host as a deployed app instead.
 */
export async function handleHostPreview(request: Request, env: Env, host: string): Promise<Response | null> {
	const url = new URL(request.url);

	const cookieToken = readPreviewCookie(request);
	if (cookieToken) {
		const claims = await verifyHostPreviewToken(env, cookieToken, host);
		if (claims && (await isPreviewVersionCurrent(env, claims.spaceName, claims))) {
			const limited = await enforcePreviewRateLimit(env, cookieToken, request);
			if (limited) return limited;
			return forwardToSpacePreview(request, env, claims.spaceName, { branch: claims.branch });
		}
	}

	const queryToken = url.searchParams.get('t') ?? '';
	if (!queryToken) return null;
	const claims = await verifyHostPreviewToken(env, queryToken, host);
	if (!claims || !(await isPreviewVersionCurrent(env, claims.spaceName, claims))) return null;
	const limited = await enforcePreviewRateLimit(env, queryToken, request);
	if (limited) return limited;
	const response = await forwardToSpacePreview(request, env, claims.spaceName, { branch: claims.branch });
	if (isWebSocketResponse(response)) return response;
	const withCookie = new Response(response.body, response);
	withCookie.headers.append(
		'Set-Cookie',
		buildHostPreviewCookie({ token: queryToken, secure: url.protocol === 'https:', ttlSeconds: EMBEDDED_PREVIEW_TOKEN_TTL_SECONDS }),
	);
	return withCookie;
}
