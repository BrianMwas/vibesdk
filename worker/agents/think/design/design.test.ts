import { describe, expect, it, vi } from 'vitest';
import { contrast, mix, toHslComponents } from './color';
import { chooseDesign, type DesignCompletion } from './choose';
import {
	DESIGN_FILE_PATH,
	SHORTLIST_SIZE,
	fallbackDirection,
	normaliseSections,
	parseDesignInput,
	shortlist,
	type DesignDirection,
} from './direction';
import { FONT_PAIRINGS, fontsHref } from './fonts';
import { PALETTES, paletteProblems, paletteTokens } from './palettes';
import { PAGE_STYLES_MARKER, STYLES_CSS_PATH, designSeedFiles, renderDesignJson, renderDesignSteps, renderStylesCss } from './render';

const KIT_TOKENS = [
	'--background', '--foreground', '--card', '--card-foreground', '--popover', '--popover-foreground',
	'--primary', '--primary-foreground', '--secondary', '--secondary-foreground', '--muted',
	'--muted-foreground', '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
	'--border', '--input', '--ring',
];

/** A completion that answers with `answer` whatever it is asked. */
function answering(answer: unknown): DesignCompletion {
	return (async () => answer) as DesignCompletion;
}

describe('color', () => {
	it('measures WCAG contrast', () => {
		expect(contrast('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
		expect(contrast('#777777', '#777777')).toBeCloseTo(1, 5);
	});

	it('writes bare HSL components and mixes in sRGB', () => {
		expect(toHslComponents('#FF0000')).toBe('0 100% 50%');
		expect(toHslComponents('#FFFFFF')).toBe('0 0% 100%');
		expect(mix('#000000', '#FFFFFF', 0.5)).toBe('#808080');
	});
});

describe('palettes', () => {
	it('has unique ids and both light and dark options', () => {
		expect(new Set(PALETTES.map((palette) => palette.id)).size).toBe(PALETTES.length);
		const dark = PALETTES.filter((palette) => paletteTokens(palette.colors).dark);
		expect(dark.length).toBeGreaterThanOrEqual(SHORTLIST_SIZE.darkPalettes);
		expect(PALETTES.length - dark.length).toBeGreaterThanOrEqual(SHORTLIST_SIZE.lightPalettes);
	});

	it.each(PALETTES.map((palette) => [palette.id, palette] as const))('%s is readable everywhere the kit puts text', (_id, palette) => {
		expect(paletteProblems(palette.colors)).toEqual([]);
	});

	it('derives every token the kit reads, plus the highlight', () => {
		const { tokens } = paletteTokens(PALETTES[0].colors);
		for (const token of [...KIT_TOKENS, '--highlight', '--highlight-foreground']) expect(tokens[token]).toMatch(/^#[0-9A-F]{6}$/);
	});

	it('reports a palette whose button text cannot be read', () => {
		const problems = paletteProblems({ background: '#FFFFFF', foreground: '#111111', primary: '#F5C400', surface: '#F4F4F4', highlight: '#1D4ED8' });
		expect(problems.some((problem) => problem.startsWith('--primary on --background'))).toBe(true);
	});
});

describe('fonts', () => {
	it('has unique ids', () => {
		expect(new Set(FONT_PAIRINGS.map((pairing) => pairing.id)).size).toBe(FONT_PAIRINGS.length);
	});

	it('loads both faces in one request, merging a family used for both roles', () => {
		const fraunces = FONT_PAIRINGS.find((pairing) => pairing.id === 'fraunces-source')!;
		expect(fontsHref(fraunces)).toBe(
			'https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Source+Sans+3:wght@400;600&display=swap',
		);
		const manrope = FONT_PAIRINGS.find((pairing) => pairing.id === 'manrope')!;
		expect(fontsHref(manrope)).toBe('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap');
	});
});

describe('normaliseSections', () => {
	it('frames the body sections with header, one hero and footer', () => {
		expect(normaliseSections(['feature-grid', 'hero-workflow', 'process-steps', 'faq', 'contact'])).toEqual([
			'marketing-header', 'hero-workflow', 'feature-grid', 'process-steps', 'faq', 'contact', 'site-footer',
		]);
	});

	it('keeps the first hero only and drops repeats and unknown names', () => {
		expect(normaliseSections(['site-footer', 'hero-split', 'hero-statement', 'faq', 'faq', 'data-table', 'marketing-header'])).toEqual([
			'marketing-header', 'hero-split', 'faq', 'site-footer',
		]);
	});

	it('keeps one block from each group of alternatives', () => {
		expect(normaliseSections(['hero-product', 'process-interactive', 'faq-topics', 'process-steps', 'faq', 'contact'])).toEqual([
			'marketing-header', 'hero-product', 'process-interactive', 'faq-topics', 'contact', 'site-footer',
		]);
	});

	it('gives an empty page a hero, features and contact', () => {
		expect(normaliseSections([])).toEqual(['marketing-header', 'hero-split', 'feature-grid', 'contact', 'site-footer']);
	});
});

describe('shortlist', () => {
	it('is the same for the same app and lists light palettes first', () => {
		const first = shortlist('app-123');
		expect(shortlist('app-123')).toEqual(first);
		expect(first.palettes).toHaveLength(SHORTLIST_SIZE.lightPalettes + SHORTLIST_SIZE.darkPalettes);
		expect(first.fonts).toHaveLength(SHORTLIST_SIZE.fonts);
		const modes = first.palettes.map((palette) => paletteTokens(palette.colors).dark);
		expect(modes).toEqual([...Array(SHORTLIST_SIZE.lightPalettes).fill(false), ...Array(SHORTLIST_SIZE.darkPalettes).fill(true)]);
	});

	it('offers different apps different options', () => {
		const seeds = Array.from({ length: 30 }, (_, index) => `app-${index}`);
		const firstPalettes = new Set(seeds.map((seed) => shortlist(seed).palettes[0].id));
		const firstFonts = new Set(seeds.map((seed) => shortlist(seed).fonts[0].id));
		expect(firstPalettes.size).toBeGreaterThanOrEqual(6);
		expect(firstFonts.size).toBeGreaterThanOrEqual(8);
	});
});

describe('chooseDesign', () => {
	const seed = 'app-bakery';
	const options = shortlist(seed);

	it('turns a website choice into a direction with a valid section order', async () => {
		const result = await chooseDesign({
			brief: 'A website for Mama Njeri Bakery in Nairobi',
			seed,
			complete: answering({
				kind: 'website',
				sections: ['hero-split', 'feature-grid', 'contact'],
				palette: options.palettes[1].id,
				fonts: options.fonts[2].id,
				radius: 'large',
				signature: 'Today\'s bakes as a handwritten-style board. ',
			}),
		});
		expect(result.kind).toBe('direction');
		const direction = (result as { direction: DesignDirection }).direction;
		expect(direction).toMatchObject({
			kind: 'website',
			sections: ['marketing-header', 'hero-split', 'feature-grid', 'contact', 'site-footer'],
			palette: { id: options.palettes[1].id },
			fonts: { id: options.fonts[2].id },
			radius: 'large',
			mode: 'light',
			signature: 'Today\'s bakes as a handwritten-style board.',
			source: 'chosen',
		});
	});

	it('leaves the structure of an app to the builder', async () => {
		const result = await chooseDesign({
			brief: 'An inventory dashboard',
			seed,
			complete: answering({ kind: 'app', sections: ['faq'], palette: options.palettes[6].id, fonts: options.fonts[0].id, radius: 'small', signature: 'x' }),
		});
		expect(result).toMatchObject({ kind: 'direction', direction: { kind: 'app', sections: null, mode: 'dark' } });
	});

	it('fixes nothing for a request with no conventional UI', async () => {
		const result = await chooseDesign({
			brief: 'A JSON API for exchange rates',
			seed,
			complete: answering({ kind: 'other', sections: [], palette: options.palettes[0].id, fonts: options.fonts[0].id, radius: 'default', signature: '' }),
		});
		expect(result).toEqual({ kind: 'none' });
	});

	it('falls back to the shortlist look when the model fails, answers outside the shortlist or is too slow', async () => {
		const fallback = { kind: 'direction', direction: fallbackDirection(seed) };
		const onError = vi.fn();
		const outside = PALETTES.find((palette) => !options.palettes.includes(palette))!.id;

		await expect(chooseDesign({ brief: 'x', seed, onError, complete: async () => { throw new Error('gateway 500'); } })).resolves.toEqual(fallback);
		await expect(
			chooseDesign({ brief: 'x', seed, onError, complete: answering({ kind: 'website', sections: [], palette: outside, fonts: options.fonts[0].id, radius: 'default', signature: '' }) }),
		).resolves.toEqual(fallback);
		await expect(chooseDesign({ brief: 'x', seed, onError, timeoutMs: 10, complete: () => new Promise(() => {}) })).resolves.toEqual(fallback);
		expect(onError).toHaveBeenCalledTimes(3);
		expect(fallback.direction).toMatchObject({ kind: 'app', sections: null, source: 'fallback', palette: options.palettes[0] });
	});

	it('offers only this app\'s shortlist to the model', async () => {
		let user = '';
		await chooseDesign({
			brief: 'A florist',
			seed,
			complete: (async (prompt: { user: string }) => {
				user = prompt.user;
				throw new Error('stop');
			}) as DesignCompletion,
		});
		for (const palette of PALETTES) expect(user.includes(`- ${palette.id} (`)).toBe(options.palettes.includes(palette));
		expect(user).toContain('<request>\nA florist\n</request>');
	});
});

describe('parseDesignInput', () => {
	it('reads a curated palette and pairing', () => {
		const result = parseDesignInput(JSON.stringify({ palette: 'orchard', fonts: 'fraunces-source', sections: ['faq'], signature: 'The bread board.' }));
		expect(result).toMatchObject({
			ok: true,
			direction: {
				kind: 'website',
				sections: ['marketing-header', 'hero-split', 'faq', 'site-footer'],
				palette: { id: 'orchard' },
				radius: 'default',
				mode: 'light',
				source: 'embedder',
			},
		});
	});

	it('accepts a brand\'s own colours when they are readable', () => {
		const colors = { background: '#0B1220', foreground: '#E8EDF5', primary: '#7CC4FF', surface: '#16213A', highlight: '#FFB454' };
		expect(parseDesignInput(JSON.stringify({ kind: 'app', palette: { name: 'Kito', colors }, fonts: 'manrope' }))).toMatchObject({
			ok: true,
			direction: { kind: 'app', sections: null, palette: { id: 'custom', name: 'Kito', colors }, mode: 'dark' },
		});
	});

	it('says why a design cannot be used', () => {
		const unreadable = { background: '#FFFFFF', foreground: '#111111', primary: '#F5C400', surface: '#F4F4F4', highlight: '#1D4ED8' };
		const cases: [string, string][] = [
			['{not json', 'not valid JSON'],
			[JSON.stringify({ palette: 'nope', fonts: 'manrope' }), 'unknown palette "nope"'],
			[JSON.stringify({ palette: 'orchard', fonts: 'comic-sans' }), 'unknown font pairing "comic-sans"'],
			[JSON.stringify({ palette: { colors: unreadable }, fonts: 'manrope' }), 'palette is hard to read'],
			[JSON.stringify({ palette: { colors: { ...unreadable, primary: 'blue' } }, fonts: 'manrope' }), 'palette.colors.primary'],
			[JSON.stringify({ palette: 'orchard', fonts: 'manrope', extra: true }), 'design.json'],
		];
		for (const [text, error] of cases) {
			const result = parseDesignInput(text);
			expect(result.ok).toBe(false);
			expect((result as { error: string }).error).toContain(error);
		}
	});

	it('round-trips what the build writes to design.json', () => {
		for (const direction of [fallbackDirection('a'), fallbackDirection('b')]) {
			const reread = parseDesignInput(renderDesignJson(direction));
			expect(reread).toMatchObject({ ok: true, direction: { ...direction, source: 'embedder' } });
		}
		const custom = parseDesignInput(JSON.stringify({ palette: { name: 'Kito', colors: PALETTES[0].colors }, fonts: 'manrope', sections: ['faq'] }));
		if (!custom.ok) throw new Error(custom.error);
		expect(parseDesignInput(renderDesignJson(custom.direction))).toEqual(custom);
	});
});

describe('render', () => {
	const website = parseDesignInput(
		JSON.stringify({ palette: 'midnight', fonts: 'oswald-lato', radius: 'sharp', sections: ['feature-grid', 'contact'], signature: 'The class timetable as a bold grid.' }),
	);
	if (!website.ok) throw new Error(website.error);
	const direction = website.direction;

	it('writes a stylesheet that loads the fonts first and sets every token for light and dark', () => {
		const css = renderStylesCss(direction);
		expect(css.startsWith(`@import url('${fontsHref(direction.fonts)}');`)).toBe(true);
		expect(css).toContain(':root,\n:root.dark {');
		for (const token of [...KIT_TOKENS, '--highlight']) expect(css).toMatch(new RegExp(`\\t${token}: \\d+(\\.\\d)? \\d+(\\.\\d)?% \\d+(\\.\\d)?%;`));
		expect(css).toContain("--font-heading: 'Oswald', sans-serif;");
		expect(css).toContain('text-transform: uppercase;');
		expect(css.trimEnd().endsWith(PAGE_STYLES_MARKER)).toBe(true);
		expect(renderStylesCss(fallbackDirection('x'))).not.toContain('text-transform');
	});

	it('seeds the stylesheet and design.json', () => {
		expect(Object.keys(designSeedFiles(direction)).sort()).toEqual([DESIGN_FILE_PATH, STYLES_CSS_PATH].sort());
	});

	it('tells the builder the exact sections and scaffold arguments', () => {
		const steps = renderDesignSteps(direction).join('\n');
		expect(steps).toContain('exactly these sections, in this order: marketing-header, hero-split, feature-grid, contact, site-footer');
		expect(steps).toContain('`radius` "sharp" and `mode` "dark", and no `theme`');
		expect(steps).toContain('Signature element: The class timetable as a bold grid.');
		expect(steps).toContain('`frontend-design-landing-page`');
		expect(steps).not.toContain('design-archetypes');
	});

	it('leaves an app\'s sections to the builder', () => {
		const steps = renderDesignSteps(fallbackDirection('x')).join('\n');
		expect(steps).toContain('once with every section the page needs');
		expect(steps).toContain('`frontend-design-saas`');
	});
});
