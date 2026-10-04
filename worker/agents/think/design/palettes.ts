/**
 * Curated palettes and the full set of kit tokens derived from each.
 *
 * A palette is five colours; the other tokens (card, muted, border, the
 * foregrounds) are derived so every combination the kit renders stays
 * readable. `highlight` is the one colour reserved for a site's signature
 * element; it is not the kit's `--accent`, which shadcn uses for hover and
 * selected surfaces and must stay quiet.
 */
import { contrast, isDark, mix, mostReadable } from './color';

export interface PaletteColors {
	background: string;
	foreground: string;
	/** Buttons, links, focus rings. */
	primary: string;
	/** Tinted surface for secondary buttons, alternating bands and hover states. */
	surface: string;
	/** The signature element's colour; used once or twice per page. */
	highlight: string;
}

export interface Palette {
	id: string;
	name: string;
	/** What it suits, read by the model choosing a palette for a brief. */
	mood: string;
	colors: PaletteColors;
}

export const PALETTES: readonly Palette[] = [
	{ id: 'harbour', name: 'Harbour', mood: 'calm, trustworthy, coastal; clinics, consultancies, marine and travel services', colors: { background: '#F7F9FA', foreground: '#0F2430', primary: '#0B5D7A', surface: '#E3EEF2', highlight: '#C77C12' } },
	{ id: 'orchard', name: 'Orchard', mood: 'natural, organic, fresh; groceries, farms, bakeries, wellness', colors: { background: '#FBFAF5', foreground: '#1F2A1C', primary: '#2F5D3A', surface: '#E9EFE1', highlight: '#B07D00' } },
	{ id: 'ledger', name: 'Ledger', mood: 'precise, professional; finance, accounting, B2B software, insurance', colors: { background: '#FFFFFF', foreground: '#111827', primary: '#1D3FA6', surface: '#EEF2FB', highlight: '#047857' } },
	{ id: 'blush', name: 'Blush', mood: 'warm, elegant, playful; salons, florists, beauty, bridal', colors: { background: '#FFF7F5', foreground: '#2B1B1E', primary: '#A62B55', surface: '#FBE7EC', highlight: '#2F6F6E' } },
	{ id: 'citrus', name: 'Citrus', mood: 'energetic, bright; street food, juice bars, kids, retail promotions', colors: { background: '#FFFDF2', foreground: '#1E1B12', primary: '#C2410C', surface: '#FFF0C2', highlight: '#0E7490' } },
	{ id: 'gallery', name: 'Gallery', mood: 'minimal, editorial, confident; fashion, architecture, photography, design studios', colors: { background: '#FAFAF9', foreground: '#1C1917', primary: '#1C1917', surface: '#EFEDE8', highlight: '#B91C1C' } },
	{ id: 'sky', name: 'Sky', mood: 'friendly, clear, modern; schools, tutoring, apps, home services', colors: { background: '#F5F9FF', foreground: '#0B1B33', primary: '#2155CD', surface: '#E1ECFF', highlight: '#B45309' } },
	{ id: 'plum', name: 'Plum', mood: 'rich, celebratory; events, spas, perfumeries, premium gifts', colors: { background: '#FBF8FC', foreground: '#24132B', primary: '#6B2D7B', surface: '#F1E6F4', highlight: '#A16207' } },
	{ id: 'ink', name: 'Sand & Ink', mood: 'heritage, steady, crafted; law firms, hotels, furniture makers, schools', colors: { background: '#F6F1E7', foreground: '#1A1A2E', primary: '#22305E', surface: '#EAE2D3', highlight: '#2E7D5B' } },
	{ id: 'mint', name: 'Mint', mood: 'clean, reassuring; dental, pharmacies, physiotherapy, laundry', colors: { background: '#F4FBF9', foreground: '#0D2B29', primary: '#0F766E', surface: '#DDF3EE', highlight: '#C2410C' } },
	{ id: 'hivis', name: 'Hi-Vis', mood: 'dark, bold, high-visibility; construction, logistics, hardware, driving schools', colors: { background: '#151515', foreground: '#F5F5F0', primary: '#F5C400', surface: '#262626', highlight: '#5AB0FF' } },
	{ id: 'rosewood', name: 'Rosewood', mood: 'deep, refined; restaurants, wine, jewellers, tailors', colors: { background: '#FDFBF9', foreground: '#2A1A14', primary: '#7A2E1F', surface: '#F3E8E2', highlight: '#A07A10' } },
	{ id: 'midnight', name: 'Midnight', mood: 'dark, premium, technical; software, security, nightlife, studios', colors: { background: '#0B1220', foreground: '#E8EDF5', primary: '#7CC4FF', surface: '#16213A', highlight: '#FFB454' } },
	{ id: 'espresso', name: 'Espresso', mood: 'dark, warm, artisan; cafes, bars, barbers, leather goods', colors: { background: '#1C1512', foreground: '#F3ECE6', primary: '#E0B07A', surface: '#2A201B', highlight: '#8FBF9F' } },
	{ id: 'forest', name: 'Forest Night', mood: 'dark, outdoorsy, grounded; safaris, tours, eco lodges, landscaping', colors: { background: '#0F1A14', foreground: '#E6F0E9', primary: '#8BD3A7', surface: '#18271E', highlight: '#F2C14E' } },
	{ id: 'velvet', name: 'Velvet', mood: 'dark, glamorous; fashion, makeup artists, music, events', colors: { background: '#140F1C', foreground: '#F1EAF7', primary: '#E7A4C9', surface: '#221A2D', highlight: '#F6D27A' } },
	{ id: 'graphite', name: 'Graphite', mood: 'dark, strong, industrial; gyms, garages, car detailing, recording studios', colors: { background: '#121212', foreground: '#F2F2F2', primary: '#F2F2F2', surface: '#1E1E1E', highlight: '#FF6B4A' } },
	{ id: 'ocean', name: 'Deep Ocean', mood: 'dark, cool, airy; diving, beach resorts, boat hire, seafood', colors: { background: '#06232B', foreground: '#E3F4F6', primary: '#5FD1D8', surface: '#0D3440', highlight: '#F4A259' } },
];

/** Every kit token, as hex. Rendered to bare HSL by `render.ts`. */
export type PaletteTokens = Record<string, string>;

const MIN_TEXT_CONTRAST = 4.5;

/** The muted text colour closest to the foreground's softness that stays readable on both surfaces. */
function mutedForeground(foreground: string, background: string, muted: string): string {
	for (let amount = 0.45; amount > 0; amount -= 0.05) {
		const candidate = mix(foreground, background, amount);
		if (contrast(candidate, background) >= MIN_TEXT_CONTRAST && contrast(candidate, muted) >= MIN_TEXT_CONTRAST) return candidate;
	}
	return foreground;
}

/** Text for a filled colour: the palette's own text colours first, then white or near-black. */
function textOn(fill: string, colors: PaletteColors): string {
	return mostReadable(fill, [colors.foreground, colors.background, '#FFFFFF', '#0A0A0A']);
}

export function paletteTokens(colors: PaletteColors): { tokens: PaletteTokens; dark: boolean } {
	const dark = isDark(colors.background);
	const card = dark ? mix(colors.background, colors.foreground, 0.04) : mix(colors.background, '#FFFFFF', 0.6);
	const muted = mix(colors.background, colors.foreground, dark ? 0.08 : 0.05);
	const border = mix(colors.background, colors.foreground, dark ? 0.18 : 0.13);
	const destructive = dark ? '#F97066' : '#B42318';
	const primaryForeground = textOn(colors.primary, colors);
	return {
		dark,
		tokens: {
			'--background': colors.background,
			'--foreground': colors.foreground,
			'--card': card,
			'--card-foreground': colors.foreground,
			'--popover': card,
			'--popover-foreground': colors.foreground,
			'--primary': colors.primary,
			'--primary-foreground': primaryForeground,
			'--secondary': colors.surface,
			'--secondary-foreground': colors.foreground,
			'--muted': muted,
			'--muted-foreground': mutedForeground(colors.foreground, colors.background, muted),
			'--accent': colors.surface,
			'--accent-foreground': colors.foreground,
			'--destructive': destructive,
			'--destructive-foreground': textOn(destructive, colors),
			'--border': border,
			'--input': border,
			'--ring': colors.primary,
			'--highlight': colors.highlight,
			'--highlight-foreground': textOn(colors.highlight, colors),
			'--sidebar-background': muted,
			'--sidebar-foreground': colors.foreground,
			'--sidebar-primary': colors.primary,
			'--sidebar-primary-foreground': primaryForeground,
			'--sidebar-accent': colors.surface,
			'--sidebar-accent-foreground': colors.foreground,
			'--sidebar-border': border,
			'--sidebar-ring': colors.primary,
		},
	};
}

/** Text/fill pairs the kit renders, with the contrast each needs. */
const READABLE_PAIRS: readonly [text: string, fill: string, minimum: number][] = [
	['--foreground', '--background', 7],
	['--card-foreground', '--card', MIN_TEXT_CONTRAST],
	['--primary-foreground', '--primary', MIN_TEXT_CONTRAST],
	['--secondary-foreground', '--secondary', MIN_TEXT_CONTRAST],
	['--muted-foreground', '--muted', MIN_TEXT_CONTRAST],
	['--muted-foreground', '--background', MIN_TEXT_CONTRAST],
	['--accent-foreground', '--accent', MIN_TEXT_CONTRAST],
	['--highlight-foreground', '--highlight', MIN_TEXT_CONTRAST],
	['--primary', '--background', 3],
	['--highlight', '--background', 3],
];

/** Every pair that would be hard to read, said so it can be fixed. Empty means the palette is usable. */
export function paletteProblems(colors: PaletteColors): string[] {
	const { tokens } = paletteTokens(colors);
	return READABLE_PAIRS.flatMap(([text, fill, minimum]) => {
		const ratio = contrast(tokens[text], tokens[fill]);
		return ratio >= minimum ? [] : [`${text} on ${fill} is ${ratio.toFixed(2)}:1, needs ${minimum}:1`];
	});
}
