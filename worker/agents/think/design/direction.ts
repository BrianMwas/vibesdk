/**
 * The design direction: what a site looks like and which sections it has,
 * decided before the build so the builder fills a design instead of falling
 * back on its defaults.
 *
 * It is chosen per app from a seeded shortlist (`shortlist`), so two similar
 * briefs are offered different palettes and type and do not converge on the
 * same look. An embedding platform can instead supply its own as `design.json`
 * in the seed files (`parseDesignInput`), e.g. built from a brand's colours.
 */
import { z } from 'zod';
import { RADIUS_PRESETS, UI_BLOCKS } from '../ui-kit/catalog';
import { isHex } from './color';
import { FONT_PAIRINGS, type FontPairing } from './fonts';
import { PALETTES, paletteProblems, paletteTokens, type Palette, type PaletteColors } from './palettes';

export const DESIGN_FILE_PATH = 'design.json';

export const RADIUS_NAMES = RADIUS_PRESETS.map((preset) => preset.name) as [string, ...string[]];

/** Marketing blocks a website's section list is drawn from. */
export const MARKETING_BLOCKS = UI_BLOCKS.filter((block) => block.category === 'marketing');
export const MARKETING_BLOCK_NAMES = MARKETING_BLOCKS.map((block) => block.name) as [string, ...string[]];

const HEADER = 'marketing-header';
const FOOTER = 'site-footer';
const HEROES: readonly string[] = ['hero-split', 'hero-centered'];
const DEFAULT_MIDDLE: readonly string[] = ['feature-grid', 'contact'];

export interface DesignDirection {
	/** A website has its sections fixed; an app gets the look only. */
	kind: 'website' | 'app';
	/** Block names in page order, or null when the builder chooses the structure. */
	sections: string[] | null;
	palette: Pick<Palette, 'id' | 'name' | 'colors'>;
	fonts: FontPairing;
	radius: string;
	mode: 'light' | 'dark';
	/** The one memorable element the page is built around. */
	signature: string;
	/** Who decided: the design model, the fallback when it failed, or the embedding platform. */
	source: 'chosen' | 'fallback' | 'embedder';
}

/**
 * A website's sections in a valid order: header, one hero, the body sections
 * once each in the order given, footer. Unknown and repeated names are dropped.
 */
export function normaliseSections(names: readonly string[]): string[] {
	const known = new Set<string>(MARKETING_BLOCK_NAMES);
	const unique = [...new Set(names)].filter((name) => known.has(name));
	const hero = unique.find((name) => HEROES.includes(name)) ?? HEROES[0];
	const middle = unique.filter((name) => name !== HEADER && name !== FOOTER && !HEROES.includes(name));
	return [HEADER, hero, ...(middle.length > 0 ? middle : DEFAULT_MIDDLE), FOOTER];
}

/** A small deterministic PRNG (mulberry32) seeded from a string. */
function seededRandom(seed: string): () => number {
	let state = 0;
	for (let index = 0; index < seed.length; index += 1) state = Math.imul(state ^ seed.charCodeAt(index), 2654435761) >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let value = state;
		value = Math.imul(value ^ (value >>> 15), value | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
	const copy = [...items];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const other = Math.floor(random() * (index + 1));
		[copy[index], copy[other]] = [copy[other], copy[index]];
	}
	return copy;
}

export const SHORTLIST_SIZE = { lightPalettes: 5, darkPalettes: 3, fonts: 6 } as const;

/**
 * The palettes and pairings offered for one app. Seeded by the app id, so the
 * same app always gets the same options and different apps get different ones.
 * Light palettes are listed first; the fallback takes the first of each.
 */
export function shortlist(seed: string): { palettes: Palette[]; fonts: FontPairing[] } {
	const random = seededRandom(seed);
	const order = shuffled(PALETTES, random);
	const light = order.filter((palette) => !paletteTokens(palette.colors).dark).slice(0, SHORTLIST_SIZE.lightPalettes);
	const dark = order.filter((palette) => paletteTokens(palette.colors).dark).slice(0, SHORTLIST_SIZE.darkPalettes);
	return { palettes: [...light, ...dark], fonts: shuffled(FONT_PAIRINGS, random).slice(0, SHORTLIST_SIZE.fonts) };
}

export function modeOf(colors: PaletteColors): 'light' | 'dark' {
	return paletteTokens(colors).dark ? 'dark' : 'light';
}

/** The look only, for when the design model could not be reached. */
export function fallbackDirection(seed: string): DesignDirection {
	const { palettes, fonts } = shortlist(seed);
	const palette = palettes[0];
	return {
		kind: 'app',
		sections: null,
		palette,
		fonts: fonts[0],
		radius: 'default',
		mode: modeOf(palette.colors),
		signature: '',
		source: 'fallback',
	};
}

const hexColour = z.string().refine(isHex, 'A six-digit hex colour like #1D3FA6');

const paletteColorsSchema = z.object({
	background: hexColour,
	foreground: hexColour,
	primary: hexColour,
	surface: hexColour,
	highlight: hexColour,
});

/** What an embedding platform may put in `design.json`. */
export const designInputSchema = z
	.object({
		kind: z.enum(['website', 'app']).default('website'),
		sections: z.array(z.string()).max(12).optional(),
		/** A curated palette id, or the brand's own five colours. */
		palette: z.union([z.string(), z.object({ name: z.string().min(1).max(40).optional(), colors: paletteColorsSchema })]),
		/** A curated pairing id. */
		fonts: z.string(),
		radius: z.enum(RADIUS_NAMES).default('default'),
		signature: z.string().max(300).optional(),
	})
	.strict();

export type DesignInputResult = { ok: true; direction: DesignDirection } | { ok: false; error: string };

/** An embedder's `design.json`, checked and resolved, or why it cannot be used. */
export function parseDesignInput(text: string): DesignInputResult {
	let raw: unknown;
	try {
		raw = JSON.parse(text);
	} catch {
		return { ok: false, error: 'design.json is not valid JSON' };
	}
	const parsed = designInputSchema.safeParse(raw);
	if (!parsed.success) {
		const issue = parsed.error.issues[0];
		return { ok: false, error: `design.json: ${issue.path.join('.') || 'input'}: ${issue.message}` };
	}
	const input = parsed.data;

	let palette: DesignDirection['palette'];
	if (typeof input.palette === 'string') {
		const found = PALETTES.find((candidate) => candidate.id === input.palette);
		if (!found) return { ok: false, error: `design.json: unknown palette "${input.palette}"` };
		palette = found;
	} else {
		const problems = paletteProblems(input.palette.colors);
		if (problems.length > 0) return { ok: false, error: `design.json: palette is hard to read: ${problems.join('; ')}` };
		palette = { id: 'custom', name: input.palette.name ?? 'Brand', colors: input.palette.colors };
	}

	const fonts = FONT_PAIRINGS.find((pairing) => pairing.id === input.fonts);
	if (!fonts) return { ok: false, error: `design.json: unknown font pairing "${input.fonts}"` };

	return {
		ok: true,
		direction: {
			kind: input.kind,
			sections: input.kind === 'website' ? normaliseSections(input.sections ?? []) : null,
			palette,
			fonts,
			radius: input.radius,
			mode: modeOf(palette.colors),
			signature: input.signature ?? '',
			source: 'embedder',
		},
	};
}
