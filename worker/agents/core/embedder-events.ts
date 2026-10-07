/**
 * Progress for a platform that embeds the builder and keeps no WebSocket open.
 *
 * A server-side caller (a CRM building its customer's website from a scheduled
 * job, say) cannot hold the session's socket for the length of a build. When its
 * embedderContext names a `callbackUrl`, the few events it needs are posted
 * there instead: the build started, the design was chosen, a file was written,
 * the agent finished a turn, a preview is ready, the site was published, or
 * something failed. Each is derived from the WebSocket message the builder's own
 * UI receives, so the two can never disagree.
 *
 * Deliveries are signed to the Standard Webhooks specification with
 * EMBEDDER_WEBHOOK_SECRET (`whsec_` followed by base64), so the platform can
 * verify them with any Standard Webhooks library.
 */

export type EmbedderEvent =
	| { type: 'build.started' }
	| { type: 'design.chosen'; kind: string; palette: string; fonts: string; sections: string[] }
	| { type: 'file.written'; path: string }
	| { type: 'turn.message'; text: string }
	| { type: 'build.finished'; previewUrl?: string }
	| { type: 'preview.ready'; previewUrl: string }
	| { type: 'preview.failed'; error: string }
	| { type: 'publish.started' }
	| { type: 'publish.finished'; url: string }
	| { type: 'publish.failed'; error: string }
	| { type: 'error'; error: string };

export interface EmbedderDelivery {
	agentId: string;
	/** Milliseconds since the epoch. Deliveries can arrive out of order; this orders them. */
	at: number;
	event: EmbedderEvent;
}

/** Longest text forwarded in one event; the platform shows a summary, not a transcript. */
export const MAX_EVENT_TEXT = 4_000;

const text = (value: unknown): string | undefined =>
	typeof value === 'string' && value.length > 0 ? value.slice(0, MAX_EVENT_TEXT) : undefined;

/**
 * The event a WebSocket broadcast means for the embedder, or null when it means
 * nothing to it (token streams, usage, state sync, and the rest).
 */
export function toEmbedderEvent(type: string, data: Record<string, unknown> | undefined): EmbedderEvent | null {
	const payload = data ?? {};
	switch (type) {
		case 'generation_started':
			return { type: 'build.started' };
		case 'file_generated': {
			const file = payload.file as { filePath?: unknown } | undefined;
			const path = text(file?.filePath);
			return path ? { type: 'file.written', path } : null;
		}
		case 'conversation_response': {
			// Only the finished reply of a turn: no deltas, no tool notices.
			if (payload.isStreaming !== false || payload.tool !== undefined) return null;
			const message = text(payload.message);
			return message ? { type: 'turn.message', text: message } : null;
		}
		case 'generation_complete': {
			const previewUrl = text(payload.previewURL);
			return previewUrl ? { type: 'build.finished', previewUrl } : { type: 'build.finished' };
		}
		case 'deployment_completed': {
			const previewUrl = text(payload.previewURL);
			return previewUrl ? { type: 'preview.ready', previewUrl } : null;
		}
		case 'deployment_failed':
			return { type: 'preview.failed', error: text(payload.error) ?? 'The preview build failed.' };
		case 'cloudflare_deployment_started':
			return { type: 'publish.started' };
		case 'cloudflare_deployment_completed': {
			const url = text(payload.deploymentUrl);
			return url ? { type: 'publish.finished', url } : null;
		}
		case 'cloudflare_deployment_error':
			return { type: 'publish.failed', error: text(payload.error) ?? text(payload.message) ?? 'Publishing failed.' };
		case 'error':
			return { type: 'error', error: text(payload.error) ?? 'Something went wrong.' };
		default:
			return null;
	}
}

function toBase64(bytes: ArrayBuffer): string {
	let binary = '';
	for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
	return btoa(binary);
}

/** The HMAC key a `whsec_` secret stands for: the base64 after the prefix, decoded. */
function secretKey(secret: string): Uint8Array {
	const encoded = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret;
	const binary = atob(encoded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

/** `v1,<base64 HMAC-SHA256 of "{id}.{timestamp}.{body}">`, as the specification defines it. */
export async function signDelivery(secret: string, id: string, timestamp: number, body: string): Promise<string> {
	const key = await crypto.subtle.importKey('raw', secretKey(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${timestamp}.${body}`));
	return `v1,${toBase64(signature)}`;
}

/**
 * Posts one event. Never throws: a platform that is down must not break the
 * build it is watching. Returns whether the platform accepted it.
 */
export async function deliverEmbedderEvent(input: {
	url: string;
	secret: string;
	delivery: EmbedderDelivery;
	fetchFn?: typeof fetch;
}): Promise<boolean> {
	const body = JSON.stringify(input.delivery);
	const id = `msg_${crypto.randomUUID()}`;
	const timestamp = Math.floor(input.delivery.at / 1000);
	try {
		const response = await (input.fetchFn ?? fetch)(input.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'webhook-id': id,
				'webhook-timestamp': String(timestamp),
				'webhook-signature': await signDelivery(input.secret, id, timestamp, body),
			},
			body,
		});
		return response.ok;
	} catch {
		return false;
	}
}
