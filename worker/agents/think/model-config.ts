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

export interface ThinkModel {
	/** Sent as `model` to the gateway's OpenAI-compatible endpoint: `<provider>/<model>`. */
	id: string;
	config: AIModelConfig;
}

/**
 * The model Think builds with. Set `THINK_MODEL_ID` (in `.dev.vars` locally, or
 * as a Worker variable) to a gateway model id such as
 * `workers-ai/@cf/moonshotai/kimi-k3` or `openrouter/moonshotai/kimi-k3` to try
 * another model without a code change. The provider is the id's first segment
 * and decides which `<PROVIDER>_API_KEY` is used.
 */
export function resolveThinkModel(env: { THINK_MODEL_ID?: string }): ThinkModel {
	const id = env.THINK_MODEL_ID?.trim() || DEFAULT_THINK_MODEL_ID;
	const slash = id.indexOf('/');
	const provider = slash > 0 ? id.slice(0, slash) : 'google-ai-studio';
	const lower = id.toLowerCase();
	const known = KNOWN_THINK_MODELS.find((model) => lower.includes(model.match));
	return {
		id,
		config: {
			name: known?.name ?? id,
			size: ModelSize.REGULAR,
			provider,
			creditCost: known?.creditCost ?? UNKNOWN_MODEL.creditCost,
			contextSize: known?.contextSize ?? UNKNOWN_MODEL.contextSize,
		},
	};
}
