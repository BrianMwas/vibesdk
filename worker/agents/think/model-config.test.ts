import { describe, expect, it } from 'vitest';
import { DEFAULT_THINK_MODEL_ID, resolveThinkModel } from './model-config';

describe('resolveThinkModel', () => {
	it('builds with Gemini 3.6 Flash when THINK_MODEL_ID is unset or blank', () => {
		for (const env of [{}, { THINK_MODEL_ID: '' }, { THINK_MODEL_ID: '   ' }]) {
			const model = resolveThinkModel(env);
			expect(model.id).toBe(DEFAULT_THINK_MODEL_ID);
			expect(model.config).toMatchObject({ name: 'Gemini 3.6 Flash', provider: 'google-ai-studio', creditCost: 2 });
		}
	});

	it('takes the provider from the id, so the matching API key is used', () => {
		expect(resolveThinkModel({ THINK_MODEL_ID: 'workers-ai/@cf/moonshotai/kimi-k3' }).config.provider).toBe('workers-ai');
		expect(resolveThinkModel({ THINK_MODEL_ID: 'openrouter/moonshotai/kimi-k3' }).config.provider).toBe('openrouter');
	});

	it('prices Kimi K3 on any route at its input price', () => {
		const model = resolveThinkModel({ THINK_MODEL_ID: ' openrouter/moonshotai/kimi-k3 ' });
		expect(model.id).toBe('openrouter/moonshotai/kimi-k3');
		expect(model.config).toMatchObject({ name: 'Kimi K3', creditCost: 12, contextSize: 1_048_576 });
	});

	it('accepts a model it has no entry for, priced conservatively', () => {
		const model = resolveThinkModel({ THINK_MODEL_ID: 'anthropic/claude-sonnet-5-5' });
		expect(model.config).toMatchObject({ name: 'anthropic/claude-sonnet-5-5', provider: 'anthropic', creditCost: 12 });
	});
});
