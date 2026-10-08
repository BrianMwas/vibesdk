/**
 * Replays a thinking model's `reasoning_content` on later requests.
 *
 * Moonshot's Kimi thinking models reject a multi-step tool loop whose assistant
 * tool-call messages arrive without the `reasoning_content` they were produced
 * with. The AI SDK's OpenAI chat provider drops that field when it rebuilds the
 * history, so the reasoning is harvested from the response stream (keyed by the
 * tool-call ids it led to) and put back on the matching outgoing message.
 */

/** Responses remembered per agent; older reasoning is dropped first. */
const MAX_REMEMBERED_RESPONSES = 64;

/** What one streamed response produced: its reasoning and the tool calls it led to. */
export interface StreamedResponse {
	reasoning: string;
	toolCallIds: string[];
}

export function emptyStreamedResponse(): StreamedResponse {
	return { reasoning: '', toolCallIds: [] };
}

/** Folds one parsed SSE chunk's choices into the response being collected. */
export function collectReasoning(choices: unknown[], into: StreamedResponse): void {
	for (const choice of choices) {
		const delta = (choice as { delta?: { reasoning_content?: unknown; tool_calls?: unknown } }).delta;
		if (typeof delta?.reasoning_content === 'string') into.reasoning += delta.reasoning_content;
		if (!Array.isArray(delta?.tool_calls)) continue;
		for (const call of delta.tool_calls) {
			const id = (call as { id?: unknown })?.id;
			if (typeof id === 'string' && !into.toolCallIds.includes(id)) into.toolCallIds.push(id);
		}
	}
}

export class ReasoningReplay {
	private readonly byToolCallId = new Map<string, string>();
	private readonly order: string[][] = [];

	record(response: StreamedResponse): void {
		if (!response.reasoning || response.toolCallIds.length === 0) return;
		for (const id of response.toolCallIds) this.byToolCallId.set(id, response.reasoning);
		this.order.push(response.toolCallIds);
		while (this.order.length > MAX_REMEMBERED_RESPONSES) {
			for (const id of this.order.shift() ?? []) this.byToolCallId.delete(id);
		}
	}

	/**
	 * Sets `reasoning_content` on each assistant tool-call message that lacks it
	 * and whose tool calls we saw stream in. Returns whether anything changed.
	 */
	attach(messages: unknown[]): boolean {
		if (this.byToolCallId.size === 0) return false;
		let changed = false;
		for (const message of messages) {
			const m = message as { role?: unknown; tool_calls?: unknown; reasoning_content?: unknown };
			if (m.role !== 'assistant' || !Array.isArray(m.tool_calls) || typeof m.reasoning_content === 'string') continue;
			const reasoning = m.tool_calls
				.map((call) => (call as { id?: unknown })?.id)
				.map((id) => (typeof id === 'string' ? this.byToolCallId.get(id) : undefined))
				.find((value): value is string => value !== undefined);
			if (reasoning === undefined) continue;
			m.reasoning_content = reasoning;
			changed = true;
		}
		return changed;
	}
}

/** Kimi models are the ones that need their reasoning replayed. */
export function needsReasoningReplay(modelId: string): boolean {
	return modelId.toLowerCase().includes('kimi');
}
