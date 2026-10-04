/**
 * Choosing a design direction for a brief: one structured call to a fast
 * model, restricted to this app's shortlist. The model call is injected so the
 * rules are tested without a network.
 */
import { z } from 'zod';
import {
	MARKETING_BLOCKS,
	MARKETING_BLOCK_NAMES,
	RADIUS_NAMES,
	fallbackDirection,
	modeOf,
	normaliseSections,
	shortlist,
	type DesignDirection,
} from './direction';

/** Runs the model with a system prompt, a user prompt and a schema; resolves to the parsed object. */
export type DesignCompletion = <T extends z.ZodObject>(prompt: { system: string; user: string }, schema: T) => Promise<z.infer<T>>;

/** Long enough for a fast model, short enough that a stuck call does not hold up the session. */
export const DESIGN_CHOICE_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT = `You are the art director for a website and app builder. Before anything is built, you choose the design direction for one request: what kind of project it is, the sections of the page, the palette, the typefaces, the corner shape and the one memorable element.

Rules:
- Choose for this specific business and its customers, not for a generic site. The palette and type should suit what is sold and to whom.
- kind: "website" for a business, marketing, portfolio or landing site; "app" for a dashboard, tool or anything people sign in to use; "other" for games, APIs and anything without a conventional UI.
- sections (websites only): the page's sections in order, from the listed blocks. Start with marketing-header and one hero, end with site-footer. Use a block only when the page needs it and the request supplies its content: testimonials only when real quotes are given, pricing only when real prices are given. Never pad the page.
- Pick hero-split when the business has something to show (a product, a place, a result); hero-centered when the offer is a service or an idea.
- signature: one sentence naming a single memorable element tied to this business (for example "the menu's daily specials set as a chalkboard-style list"), not a visual effect.`;

function describeOptions(seed: string): { text: string; paletteIds: [string, ...string[]]; fontIds: [string, ...string[]] } {
	const { palettes, fonts } = shortlist(seed);
	const text = [
		'Blocks for websites:',
		...MARKETING_BLOCKS.map((block) => `- ${block.name}: ${block.description}`),
		'',
		'Palettes (choose one id):',
		...palettes.map((palette) => `- ${palette.id} (${modeOf(palette.colors)}): ${palette.mood}`),
		'',
		'Type pairings (choose one id):',
		...fonts.map((pairing) => `- ${pairing.id}: ${pairing.heading.family} with ${pairing.body.family}; ${pairing.mood}`),
		'',
		`Corner shapes: ${RADIUS_NAMES.join(', ')}.`,
	].join('\n');
	return {
		text,
		paletteIds: palettes.map((palette) => palette.id) as [string, ...string[]],
		fontIds: fonts.map((pairing) => pairing.id) as [string, ...string[]],
	};
}

function choiceSchema(paletteIds: [string, ...string[]], fontIds: [string, ...string[]]) {
	return z.object({
		kind: z.enum(['website', 'app', 'other']),
		sections: z.array(z.enum(MARKETING_BLOCK_NAMES)).describe('Websites only, in page order. Empty for apps.'),
		palette: z.enum(paletteIds),
		fonts: z.enum(fontIds),
		radius: z.enum(RADIUS_NAMES),
		signature: z.string().describe('One sentence: the single memorable element of this page.'),
	});
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(`Design choice took longer than ${ms}ms`)), ms);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(error: unknown) => {
				clearTimeout(timer);
				reject(error);
			},
		);
	});
}

export type DesignChoiceResult =
	| { kind: 'direction'; direction: DesignDirection }
	/** The request has no conventional UI, so nothing is fixed. */
	| { kind: 'none' };

/**
 * The direction for a brief. If the model fails, times out or answers with
 * ids outside the shortlist, the app still gets a readable look from the
 * shortlist (`fallbackDirection`) with its structure left to the builder.
 */
export async function chooseDesign(opts: {
	brief: string;
	seed: string;
	complete: DesignCompletion;
	timeoutMs?: number;
	onError?: (error: unknown) => void;
}): Promise<DesignChoiceResult> {
	const { text, paletteIds, fontIds } = describeOptions(opts.seed);
	const schema = choiceSchema(paletteIds, fontIds);
	try {
		const raw = await withTimeout(
			opts.complete({ system: SYSTEM_PROMPT, user: `Request:\n<request>\n${opts.brief}\n</request>\n\n${text}` }, schema),
			opts.timeoutMs ?? DESIGN_CHOICE_TIMEOUT_MS,
		);
		const choice = schema.parse(raw);
		if (choice.kind === 'other') return { kind: 'none' };
		const { palettes, fonts } = shortlist(opts.seed);
		const palette = palettes.find((candidate) => candidate.id === choice.palette)!;
		return {
			kind: 'direction',
			direction: {
				kind: choice.kind,
				sections: choice.kind === 'website' ? normaliseSections(choice.sections) : null,
				palette,
				fonts: fonts.find((pairing) => pairing.id === choice.fonts)!,
				radius: choice.radius,
				mode: modeOf(palette.colors),
				signature: choice.signature.trim().slice(0, 300),
				source: 'chosen',
			},
		};
	} catch (error) {
		opts.onError?.(error);
		return { kind: 'direction', direction: fallbackDirection(opts.seed) };
	}
}
