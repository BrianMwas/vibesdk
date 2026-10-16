import { ModelSize, type AIModelConfig } from '../inferutils/config.types';

/** The model Think builds with when `THINK_MODEL_ID` is not set. */
export const DEFAULT_THINK_MODEL_ID = 'google-ai-studio/gemini-3.6-flash';

/**
 * Display name, context window and credit cost for the models we have priced.
 * Keyed by the part of the id after the provider, so the same model reached
 * through a different gateway route (`workers-ai/...`, `openrouter/...`) still
 * matches. `creditCost` is input price per 1M tokens / $0.25, as in
 * `config.types.ts`.
 */
const KNOWN_THINK_MODELS: { match: string; name: string; creditCost: number; contextSize: number }[] = [
	{ match: 'gpt-6.1-sol', name: 'GPT-6.1 Sol', creditCost: 8, contextSize: 1_000_000 },
	{ match: 'claude-sonnet-5-5', name: 'Claude Sonnet 5.5', creditCost: 8, contextSize: 1_000_000 },
	{ match: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', creditCost: 2, contextSize: 1_048_576 },
	{ match: 'kimi-k3', name: 'Kimi K3', creditCost: 12, contextSize: 1_048_576 },
	{ match: 'gpt-5.2', name: 'GPT-5.2', creditCost: 7, contextSize: 400_000 },
	{ match: 'gpt-5.1', name: 'GPT-5.1', creditCost: 5, contextSize: 400_000 },
	{ match: 'gpt-5-mini', name: 'GPT-5 Mini', creditCost: 1, contextSize: 400_000 },
	// Claude is priced by family, at the rates in `config.types.ts`.
	{ match: 'claude-opus', name: 'Claude Opus', creditCost: 20, contextSize: 200_000 },
	{ match: 'claude-sonnet', name: 'Claude Sonnet', creditCost: 12, contextSize: 200_000 },
	{ match: 'claude-haiku', name: 'Claude Haiku', creditCost: 4, contextSize: 200_000 },
];

/** Used for an id we have no entry for: priced high so rate limits stay conservative. */
const UNKNOWN_MODEL = { creditCost: 12, contextSize: 131_072 };

/**
 * How the model is reached. GPT-6 models call functions only through the
 * Responses API (Chat Completions refuses tools for them), and Claude passes
 * its thinking blocks back between tool calls, which the OpenAI message shape
 * has no place for, so both go to the gateway's native provider routes.
 * Everything else uses the OpenAI-compatible `/compat` Chat Completions route.
 */
export type ThinkApi = 'chat' | 'responses' | 'anthropic';

/**
 * The output ceiling for a Claude turn. The AI SDK caps models it doesn't know
 * yet at 4,096 tokens, too few for a turn that writes whole files.
 */
export const ANTHROPIC_MAX_OUTPUT_TOKENS = 64_000;

export const THINK_REASONING_EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;
export type ThinkReasoningEffort = (typeof THINK_REASONING_EFFORTS)[number];

export interface ThinkModel {
	/** Sent as `model` to the gateway's OpenAI-compatible endpoint: `<provider>/<model>`. */
	id: string;
	config: AIModelConfig;
	api: ThinkApi;
	/** `THINK_REASONING_EFFORT`, when set to a value the models accept. */
	reasoningEffort?: ThinkReasoningEffort;
}

function apiFor(id: string): ThinkApi {
	const lower = id.toLowerCase();
	if (lower.startsWith('anthropic/')) return 'anthropic';
	return /(^|\/)gpt-6/.test(lower) ? 'responses' : 'chat';
}

function readEffort(value: string | undefined): ThinkReasoningEffort | undefined {
	const effort = value?.trim().toLowerCase();
	return (THINK_REASONING_EFFORTS as readonly string[]).includes(effort ?? '') ? (effort as ThinkReasoningEffort) : undefined;
}

/**
 * The model Think builds with. Set `THINK_MODEL_ID` (in `.dev.vars` locally, or
 * as a Worker variable) to a gateway model id such as
 * `workers-ai/@cf/moonshotai/kimi-k3` or `openrouter/moonshotai/kimi-k3` to try
 * another model without a code change. The provider is the id's first segment
 * and decides which `<PROVIDER>_API_KEY` is used. `THINK_REASONING_EFFORT`
 * (low, medium, high, xhigh or max) sets how hard a reasoning model thinks.
 */
export function resolveThinkModel(env: { THINK_MODEL_ID?: string; THINK_REASONING_EFFORT?: string }): ThinkModel {
	const id = env.THINK_MODEL_ID?.trim() || DEFAULT_THINK_MODEL_ID;
	const slash = id.indexOf('/');
	const provider = slash > 0 ? id.slice(0, slash) : 'google-ai-studio';
	const lower = id.toLowerCase();
	const known = KNOWN_THINK_MODELS.find((model) => lower.includes(model.match));
	const reasoningEffort = readEffort(env.THINK_REASONING_EFFORT);
	return {
		id,
		api: apiFor(id),
		...(reasoningEffort ? { reasoningEffort } : {}),
		config: {
			name: known?.name ?? id,
			size: ModelSize.REGULAR,
			provider,
			creditCost: known?.creditCost ?? UNKNOWN_MODEL.creditCost,
			contextSize: known?.contextSize ?? UNKNOWN_MODEL.contextSize,
		},
	};
}

/**
 * Adds what the model needs to every outgoing request, unless the request
 * already says: the configured reasoning effort (`reasoning.effort` on the
 * Responses API, `reasoning_effort` on Chat Completions, `output_config.effort`
 * on Anthropic), and for Claude an output ceiling large enough for a file.
 */
export function withRequestDefaults(bodyText: string, api: ThinkApi, effort: ThinkReasoningEffort | undefined): string {
	if (!effort && api !== 'anthropic') return bodyText;
	let json: Record<string, unknown>;
	try {
		json = JSON.parse(bodyText) as Record<string, unknown>;
	} catch {
		return bodyText;
	}
	if (api === 'anthropic') {
		if (typeof json.max_tokens !== 'number' || json.max_tokens < ANTHROPIC_MAX_OUTPUT_TOKENS) json.max_tokens = ANTHROPIC_MAX_OUTPUT_TOKENS;
		const outputConfig = (json.output_config as Record<string, unknown> | undefined) ?? {};
		if (effort && !outputConfig.effort) json.output_config = { ...outputConfig, effort };
	} else if (api === 'responses') {
		const reasoning = (json.reasoning as Record<string, unknown> | undefined) ?? {};
		if (!reasoning.effort) json.reasoning = { ...reasoning, effort };
	} else if (!json.reasoning_effort) {
		json.reasoning_effort = effort;
	}
	return JSON.stringify(json);
}
