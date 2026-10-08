import { describe, expect, it } from 'vitest';
import {
	ReasoningReplay,
	collectReasoning,
	emptyStreamedResponse,
	needsReasoningReplay,
} from './reasoning-replay';

/** The `choices` of a streamed chunk carrying a reasoning delta and/or tool-call deltas. */
function chunk(delta: Record<string, unknown>): unknown[] {
	return [{ index: 0, delta }];
}

describe('collectReasoning', () => {
	it('joins reasoning deltas and records each tool-call id once', () => {
		const response = emptyStreamedResponse();
		collectReasoning(chunk({ reasoning_content: 'Plan the ' }), response);
		collectReasoning(chunk({ reasoning_content: 'hero first.' }), response);
		collectReasoning(chunk({ tool_calls: [{ index: 0, id: 'call_1', function: { name: 'write' } }] }), response);
		collectReasoning(chunk({ tool_calls: [{ index: 0, function: { arguments: '{"path":' } }] }), response);
		collectReasoning(chunk({ tool_calls: [{ index: 0, id: 'call_1' }, { index: 1, id: 'call_2' }] }), response);

		expect(response).toEqual({ reasoning: 'Plan the hero first.', toolCallIds: ['call_1', 'call_2'] });
	});

	it('ignores chunks with no delta', () => {
		const response = emptyStreamedResponse();
		collectReasoning([{ index: 0, finish_reason: 'tool_calls' }], response);
		expect(response).toEqual({ reasoning: '', toolCallIds: [] });
	});
});

describe('ReasoningReplay', () => {
	const history = () => [
		{ role: 'system', content: 'You build sites.' },
		{ role: 'user', content: 'Build a bakery site.' },
		{ role: 'assistant', content: '', tool_calls: [{ id: 'call_1', type: 'function', function: { name: 'write', arguments: '{}' } }] },
		{ role: 'tool', tool_call_id: 'call_1', content: 'ok' },
	];

	it('puts the reasoning back on the assistant message that made the tool call', () => {
		const replay = new ReasoningReplay();
		replay.record({ reasoning: 'Plan the hero first.', toolCallIds: ['call_1'] });

		const messages = history();
		expect(replay.attach(messages)).toBe(true);
		expect(messages[2]).toMatchObject({ reasoning_content: 'Plan the hero first.' });
		expect(messages[3]).not.toHaveProperty('reasoning_content');
	});

	it('leaves reasoning the request already carries untouched', () => {
		const replay = new ReasoningReplay();
		replay.record({ reasoning: 'harvested', toolCallIds: ['call_1'] });

		const messages = history();
		Object.assign(messages[2], { reasoning_content: 'original' });
		expect(replay.attach(messages)).toBe(false);
		expect(messages[2]).toMatchObject({ reasoning_content: 'original' });
	});

	it('changes nothing for tool calls it never saw', () => {
		const replay = new ReasoningReplay();
		replay.record({ reasoning: 'other', toolCallIds: ['call_9'] });
		expect(replay.attach(history())).toBe(false);
	});

	it('does not record a response without reasoning or without tool calls', () => {
		const replay = new ReasoningReplay();
		replay.record({ reasoning: '', toolCallIds: ['call_1'] });
		replay.record({ reasoning: 'thinking only', toolCallIds: [] });
		expect(replay.attach(history())).toBe(false);
	});

	it('forgets the oldest responses once it holds 64', () => {
		const replay = new ReasoningReplay();
		for (let index = 0; index <= 64; index += 1) {
			replay.record({ reasoning: `r${index}`, toolCallIds: [`call_${index}`] });
		}
		const oldest = [{ role: 'assistant', tool_calls: [{ id: 'call_0' }] }];
		const newest = [{ role: 'assistant', tool_calls: [{ id: 'call_64' }] }];
		expect(replay.attach(oldest)).toBe(false);
		expect(replay.attach(newest)).toBe(true);
	});
});

describe('needsReasoningReplay', () => {
	it('is on for Kimi on any gateway route and off for Gemini', () => {
		expect(needsReasoningReplay('workers-ai/@cf/moonshotai/kimi-k3')).toBe(true);
		expect(needsReasoningReplay('openrouter/moonshotai/kimi-k3')).toBe(true);
		expect(needsReasoningReplay('google-ai-studio/gemini-3.6-flash')).toBe(false);
	});
});
