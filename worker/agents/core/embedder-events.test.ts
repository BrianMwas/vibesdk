import { describe, expect, it } from 'vitest';
import { deliverEmbedderEvent, MAX_EVENT_TEXT, signDelivery, toEmbedderEvent } from './embedder-events';

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

describe('signDelivery', () => {
	// The Standard Webhooks specification's own example.
	it('matches the specification', async () => {
		const secret = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';
		const body = '{"test": 2432232314}';
		expect(await signDelivery(secret, 'msg_p5jXN8AQM9LWM0D4loKWxJek', 1614265330, body)).toBe('v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=');
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

	it('never throws when the platform is down', async () => {
		const ok = await deliverEmbedderEvent({
			url: 'https://speek.example/webhooks/vibesdk',
			secret: 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw',
			delivery,
			fetchFn: async () => {
				throw new Error('offline');
			},
		});
		expect(ok).toBe(false);
	});
});
