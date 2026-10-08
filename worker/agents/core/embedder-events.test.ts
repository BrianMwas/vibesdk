import { describe, expect, it } from 'vitest';
import { deliverEmbedderEvent, forwardedEvent, isWebhookSecret, MAX_EVENT_TEXT, signDelivery, toEmbedderEvent, toQuestionEvent } from './embedder-events';

describe('toEmbedderEvent', () => {
	it('translates what the platform needs to see', () => {
		expect(toEmbedderEvent('generation_started', {})).toEqual({ type: 'build.started' });
		expect(toEmbedderEvent('file_generated', { file: { filePath: 'src/pages/Menu.tsx' } })).toEqual({ type: 'file.written', path: 'src/pages/Menu.tsx' });
		expect(toEmbedderEvent('deployment_completed', { previewURL: 'https://p.example/x' })).toEqual({ type: 'preview.ready', previewUrl: 'https://p.example/x' });
		expect(toEmbedderEvent('generation_complete', {})).toEqual({ type: 'build.finished' });
		expect(toEmbedderEvent('cloudflare_deployment_completed', { deploymentUrl: 'https://site.example' })).toEqual({
			type: 'publish.finished',
			url: 'https://site.example',
		});
		expect(toEmbedderEvent('cloudflare_deployment_error', { message: 'Deployment failed', error: 'quota' })).toEqual({ type: 'publish.failed', error: 'quota' });
	});

	it('forwards only the finished reply of a turn', () => {
		expect(toEmbedderEvent('conversation_response', { message: 'Rewrote the hero.', isStreaming: false })).toEqual({ type: 'turn.message', text: 'Rewrote the hero.' });
		expect(toEmbedderEvent('conversation_response', { message: 'Rew', isStreaming: true })).toBeNull();
		expect(toEmbedderEvent('conversation_response', { message: '', isStreaming: false })).toBeNull();
		expect(toEmbedderEvent('conversation_response', { message: 'x', isStreaming: false, tool: { name: 'Message Queued' } })).toBeNull();
	});

	it('ignores streams, usage and state sync, and bounds long text', () => {
		for (const type of ['usage_updated', 'cf_agent_state', 'file_generating']) expect(toEmbedderEvent(type, {})).toBeNull();
		const long = toEmbedderEvent('error', { error: 'x'.repeat(MAX_EVENT_TEXT + 10) });
		expect(long?.type === 'error' && long.error.length).toBe(MAX_EVENT_TEXT);
	});
});

describe('forwardedEvent', () => {
	it('says nothing at the end of a build that is waiting on an answer', () => {
		expect(forwardedEvent('generation_complete', {}, true)).toBeNull();
		expect(forwardedEvent('generation_complete', {}, false)).toEqual({ type: 'build.finished' });
		expect(forwardedEvent('file_generated', { file: { filePath: 'a.tsx' } }, true)).toEqual({ type: 'file.written', path: 'a.tsx' });
	});
});

describe('toQuestionEvent', () => {
	it('takes the first question, with its suggested answers and what it is about', () => {
		const output = JSON.stringify({
			ok: true,
			questions: [
				{ question: 'Which colours?', options: ['Brand terracotta', 'Calm greens', 'Black and white'], about: 'colours' },
				{ question: 'Second?' },
			],
		});
		expect(toQuestionEvent(output)).toEqual({
			type: 'question.asked',
			question: 'Which colours?',
			options: ['Brand terracotta', 'Calm greens', 'Black and white'],
			about: 'colours',
		});
	});

	it('keeps two to four suggested answers, or none', () => {
		expect(toQuestionEvent({ questions: [{ question: 'Q', options: ['Only one'] }] })).toEqual({ type: 'question.asked', question: 'Q' });
		expect(toQuestionEvent({ questions: [{ question: 'Q', options: ['a', 'b', 'c', 'd', 'e'] }] })).toMatchObject({ options: ['a', 'b', 'c', 'd'] });
	});

	it('ignores anything that is not a question', () => {
		for (const output of ['not json', '{}', JSON.stringify({ questions: [] }), JSON.stringify({ questions: [{ question: '' }] }), null]) {
			expect(toQuestionEvent(output)).toBeNull();
		}
	});
});

describe('signDelivery', () => {
	// The Standard Webhooks specification's own example.
	it('matches the specification', async () => {
		const secret = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';
		const body = '{"test": 2432232314}';
		expect(await signDelivery(secret, 'msg_p5jXN8AQM9LWM0D4loKWxJek', 1614265330, body)).toBe('v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=');
	});

	// The same vector is verified by Speek's own check (convex/lib/__tests__/standardWebhooks.test.ts),
	// so a change on either side that breaks the other fails a test.
	it('signs a delivery the way Speek verifies it', async () => {
		const secret = 'whsec_CzBVep/E6Q4zWH2ix+wRNluApcrvFDleg6jN8hc8YYY=';
		const body = JSON.stringify({
			agentId: 'agent-7f3c',
			at: 1767225600123,
			event: { type: 'question.asked', question: 'Which colours should the site use?', options: ['Brand terracotta', 'Calm greens'], about: 'colours' },
		});
		expect(await signDelivery(secret, 'msg_2f0c8a6e-0d1b-4c7e-9a51-3b2f6d4e8c10', 1767225600, body)).toBe('v1,/yff2gCMf3rfdAxNQbhP9vndpbRpcg/1tDUofSsF9Mw=');
	});
});

describe('isWebhookSecret', () => {
	it('accepts whsec_ followed by base64, and nothing else', () => {
		expect(isWebhookSecret('whsec_CzBVep/E6Q4zWH2ix+wRNluApcrvFDleg6jN8hc8YYY=')).toBe(true);
		for (const secret of ['', 'CzBVep/E6Q4zWH2ix+wRNluApcrvFDleg6jN8hc8YYY=', 'whsec_short', 'whsec_not base64 at all!!!!!!!!!', 'whsec_']) {
			expect(isWebhookSecret(secret)).toBe(false);
		}
	});
});

describe('deliverEmbedderEvent', () => {
	const delivery = { agentId: 'a1', at: 1_700_000_000_000, event: { type: 'build.started' as const } };

	it('posts a signed delivery', async () => {
		let seen: { url: string; init: RequestInit } | undefined;
		const ok = await deliverEmbedderEvent({
			url: 'https://speek.example/webhooks/vibesdk',
			secret: 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw',
			delivery,
			fetchFn: async (url, init) => {
				seen = { url: String(url), init: init! };
				return new Response(null, { status: 204 });
			},
		});
		expect(ok).toBe(true);
		const headers = seen!.init.headers as Record<string, string>;
		expect(headers['webhook-timestamp']).toBe('1700000000');
		expect(headers['webhook-signature']).toMatch(/^v1,/);
		expect(JSON.parse(String(seen!.init.body))).toEqual(delivery);
	});

	it('never throws when the platform is down, after trying each time', async () => {
		let attempts = 0;
		const waits: number[] = [];
		const ok = await deliverEmbedderEvent({
			url: 'https://speek.example/webhooks/vibesdk',
			secret: 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw',
			delivery,
			fetchFn: async () => {
				attempts++;
				throw new Error('offline');
			},
			wait: async (ms) => {
				waits.push(ms);
			},
		});
		expect(ok).toBe(false);
		expect(attempts).toBe(4);
		expect(waits).toEqual([1_000, 5_000, 25_000]);
	});

	it('retries a refusal with backoff, under the same id and signature', async () => {
		const seen: Record<string, string>[] = [];
		const ok = await deliverEmbedderEvent({
			url: 'https://speek.example/webhooks/vibesdk',
			secret: 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw',
			delivery,
			fetchFn: async (_url, init) => {
				seen.push(init!.headers as Record<string, string>);
				return new Response(null, { status: seen.length < 3 ? 503 : 204 });
			},
			wait: async () => undefined,
		});
		expect(ok).toBe(true);
		expect(seen).toHaveLength(3);
		expect(new Set(seen.map((headers) => headers['webhook-id'])).size).toBe(1);
		expect(new Set(seen.map((headers) => headers['webhook-signature'])).size).toBe(1);
	});

	it('sends nothing with a malformed secret', async () => {
		let attempts = 0;
		const ok = await deliverEmbedderEvent({
			url: 'https://speek.example/webhooks/vibesdk',
			secret: 'not-a-secret',
			delivery,
			fetchFn: async () => {
				attempts++;
				return new Response(null, { status: 204 });
			},
		});
		expect(ok).toBe(false);
		expect(attempts).toBe(0);
	});
});
