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
 * verify them with any Standard Webhooks library. One the platform does not
 * accept is retried with backoff, under the same id, so it can drop repeats.
 */

export type EmbedderEvent =
	| { type: 'build.started' }
	| { type: 'design.chosen'; kind: string; palette: string; fonts: string; sections: string[] }
	| { type: 'file.written'; path: string }
	| { type: 'turn.message'; text: string }
	/** The builder needs an answer before it goes on; it arrives as the next message. */
	| { type: 'question.asked'; question: string; options?: string[]; about?: string }
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

/**
 * The event a broadcast sends the embedder during a build. A build that ended
 * on a question is waiting for its answer, not finished, so it says nothing.
 */
export function forwardedEvent(type: string, data: Record<string, unknown> | undefined, askedThisBuild: boolean): EmbedderEvent | null {
	const event = toEmbedderEvent(type, data);
	return event?.type === 'build.finished' && askedThisBuild ? null : event;
}

/** The suggested answers a question carries: two to four, or none. */
export const QUESTION_OPTIONS = { min: 2, max: 4 } as const;

/**
 * The question in an `ask_questions` result, as the embedder receives it. An
 * embedded session asks one at a time, so only the first is taken.
 */
export function toQuestionEvent(output: unknown): Extract<EmbedderEvent, { type: 'question.asked' }> | null {
	let parsed: unknown = output;
	if (typeof output === 'string') {
		try {
			parsed = JSON.parse(output);
		} catch {
			return null;
		}
	}
	const questions = (parsed as { questions?: unknown } | null)?.questions;
	const first = Array.isArray(questions) ? (questions[0] as Record<string, unknown> | undefined) : undefined;
	const question = text(first?.question);
	if (!first || !question) return null;
	const options = Array.isArray(first.options)
		? first.options.map((option) => text(option)).filter((option): option is string => option !== undefined)
		: [];
	const about = text(first.about);
	return {
		type: 'question.asked',
		question,
		...(options.length >= QUESTION_OPTIONS.min ? { options: options.slice(0, QUESTION_OPTIONS.max) } : {}),
		...(about ? { about: about.slice(0, 80) } : {}),
	};
}

function toBase64(bytes: ArrayBuffer): string {
	let binary = '';
	for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
	return btoa(binary);
}

const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

/** Whether a secret is `whsec_` followed by base64 of at least 16 bytes, as the specification gives it. */
export function isWebhookSecret(secret: string): boolean {
	if (!secret.startsWith('whsec_')) return false;
	const encoded = secret.slice('whsec_'.length);
	return encoded.length >= 24 && encoded.length % 4 === 0 && BASE64.test(encoded);
}

/** The HMAC key a `whsec_` secret stands for: the base64 after the prefix, decoded. */
function secretKey(secret: string): Uint8Array {
	if (!isWebhookSecret(secret)) throw new Error('EMBEDDER_WEBHOOK_SECRET must be whsec_ followed by base64');
	const binary = atob(secret.slice('whsec_'.length));
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
 * Waits between attempts. The last is well inside the five hours a platform
 * accepts a signed delivery for, and short enough to finish while the agent is
 * still awake.
 */
export const RETRY_DELAYS_MS: readonly number[] = [1_000, 5_000, 25_000];

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Posts one event, retrying anything but a 2xx. Never throws: a platform that
 * is down must not break the build it is watching. Returns whether the
 * platform accepted it.
 */
export async function deliverEmbedderEvent(input: {
	url: string;
	secret: string;
	delivery: EmbedderDelivery;
	fetchFn?: typeof fetch;
	retryDelaysMs?: readonly number[];
	wait?: (ms: number) => Promise<void>;
}): Promise<boolean> {
	const body = JSON.stringify(input.delivery);
	const id = `msg_${crypto.randomUUID()}`;
	const timestamp = Math.floor(input.delivery.at / 1000);
	let signature: string;
	try {
		signature = await signDelivery(input.secret, id, timestamp, body);
	} catch {
		return false;
	}
	const delays = input.retryDelaysMs ?? RETRY_DELAYS_MS;
	for (let attempt = 0; attempt <= delays.length; attempt++) {
		if (attempt > 0) await (input.wait ?? sleep)(delays[attempt - 1]);
		try {
			const response = await (input.fetchFn ?? fetch)(input.url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'webhook-id': id,
					'webhook-timestamp': String(timestamp),
					'webhook-signature': signature,
				},
				body,
			});
			if (response.ok) return true;
		} catch {
			// Unreachable this time; the next attempt may get through.
		}
	}
	return false;
}
