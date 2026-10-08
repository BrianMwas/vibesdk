/**
 * Curated Google Fonts pairings (all SIL Open Font License). Weights are only
 * those each family ships, because the css2 API rejects a request for a
 * weight a static family does not have.
 */

export interface FontFace {
	family: string;
	/** Weights to load, ascending. The first is used for this role. */
	weights: readonly number[];
	/** CSS generic family used as the fallback. */
	fallback: 'serif' | 'sans-serif';
}

export interface FontPairing {
	id: string;
	/** What it suits, read by the model choosing type for a brief. */
	mood: string;
	heading: FontFace;
	body: FontFace;
	/** Headings set in capitals (condensed display faces only). */
	uppercaseHeadings?: boolean;
	/** Heading letter-spacing in em. */
	headingTracking: number;
}

const sans = (family: string, weights: readonly number[] = [400, 600]): FontFace => ({ family, weights, fallback: 'sans-serif' });
const serif = (family: string, weights: readonly number[]): FontFace => ({ family, weights, fallback: 'serif' });

export const FONT_PAIRINGS: readonly FontPairing[] = [
	{ id: 'fraunces-source', mood: 'warm editorial serif; bakeries, restaurants, food writers', heading: serif('Fraunces', [600]), body: sans('Source Sans 3'), headingTracking: -0.015 },
	{ id: 'cormorant-karla', mood: 'refined high-contrast serif; jewellers, bridal, luxury stays', heading: serif('Cormorant Garamond', [600]), body: sans('Karla'), headingTracking: 0 },
	{ id: 'spacegrotesk-plex', mood: 'technical grotesk; software, engineering, electronics', heading: sans('Space Grotesk', [600]), body: sans('IBM Plex Sans'), headingTracking: -0.02 },
	{ id: 'outfit-nunito', mood: 'friendly rounded sans; schools, childcare, home services', heading: sans('Outfit', [600]), body: sans('Nunito Sans'), headingTracking: -0.01 },
	{ id: 'sora-dmsans', mood: 'clean geometric; agencies, consultants, modern clinics', heading: sans('Sora', [700]), body: sans('DM Sans'), headingTracking: -0.025 },
	{ id: 'zilla-work', mood: 'sturdy slab serif; builders, workshops, hardware, heritage brands', heading: serif('Zilla Slab', [700]), body: sans('Work Sans'), headingTracking: -0.01 },
	{ id: 'oswald-lato', mood: 'condensed display in capitals; gyms, garages, sport, events', heading: sans('Oswald', [600]), body: sans('Lato', [400, 700]), uppercaseHeadings: true, headingTracking: 0.01 },
	{ id: 'playfair-raleway', mood: 'classic fashion serif; boutiques, salons, event planners', heading: serif('Playfair Display', [700]), body: sans('Raleway'), headingTracking: -0.01 },
	{ id: 'quicksand-mulish', mood: 'soft and light; cafes, florists, wellness, baby shops', heading: sans('Quicksand', [700]), body: sans('Mulish'), headingTracking: -0.01 },
	{ id: 'baskerville-public', mood: 'traditional book serif; law, accounting, consulting, education', heading: serif('Libre Baskerville', [700]), body: sans('Public Sans'), headingTracking: -0.01 },
	{ id: 'dmserif-dmsans', mood: 'contemporary display serif; restaurants, hotels, galleries', heading: serif('DM Serif Display', [400]), body: sans('DM Sans'), headingTracking: -0.01 },
	{ id: 'manrope', mood: 'neutral modern sans, one family; fintech, logistics, B2B', heading: sans('Manrope', [700]), body: sans('Manrope', [400, 600]), headingTracking: -0.02 },
	{ id: 'bricolage-figtree', mood: 'characterful grotesk; creative studios, street food, music', heading: sans('Bricolage Grotesque', [700]), body: sans('Figtree'), headingTracking: -0.025 },
	{ id: 'archivo', mood: 'heavy industrial sans; transport, construction, manufacturing', heading: sans('Archivo Black', [400]), body: sans('Archivo'), headingTracking: -0.01 },
	{ id: 'syne-instrument', mood: 'expressive wide display; art, design, fashion labels', heading: sans('Syne', [700]), body: sans('Instrument Sans'), headingTracking: -0.02 },
	{ id: 'spectral-rubik', mood: 'calm literary serif with a soft sans; therapists, spas, bookshops', heading: serif('Spectral', [600]), body: sans('Rubik'), headingTracking: -0.01 },
];

/** The Google Fonts stylesheet URL for a pairing, one request for both faces. */
export function fontsHref(pairing: Pick<FontPairing, 'heading' | 'body'>): string {
	const weights = new Map<string, Set<number>>();
	for (const face of [pairing.heading, pairing.body]) {
		const set = weights.get(face.family) ?? new Set<number>();
		face.weights.forEach((weight) => set.add(weight));
		weights.set(face.family, set);
	}
	const families = [...weights].map(
		([family, set]) => `family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@${[...set].sort((a, b) => a - b).join(';')}`,
	);
	return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
}

export function fontStack(face: FontFace): string {
	return `'${face.family}', ${face.fallback}`;
}
