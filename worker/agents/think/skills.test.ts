import { describe, expect, it } from 'vitest';
import { parseSkillMarkdown } from 'agents/skills';
import DESIGN_ARCHETYPES from './skills/design-archetypes/SKILL.md?raw';
import FRONTEND_DESIGN from './skills/frontend-design/SKILL.md?raw';
import WEB_DESIGN_GUIDELINES from './skills/web-design-guidelines/SKILL.md?raw';
import { createThinkSkillSource } from './skills';

function channel(hex: string): [number, number, number] {
	const value = hex.replace('#', '');
	return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16) / 255) as [number, number, number];
}

function luminance(hex: string): number {
	const [r, g, b] = channel(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (lighter + 0.05) / (darker + 0.05);
}

interface Direction {
	name: string;
	background: string;
	text: string;
	primary: string;
	accent: string;
}

/** Rows of the form `| Name | Fonts | \`bg\` \`text\` \`primary\` \`accent\` | Suits |`. */
function directionsIn(markdown: string): Direction[] {
	return markdown
		.split('\n')
		.map((line) => ({ line, hexes: [...line.matchAll(/`(#[0-9A-Fa-f]{6})`/g)].map((match) => match[1]) }))
		.filter(({ hexes }) => hexes.length === 4)
		.map(({ line, hexes }) => ({
			name: line.split('|')[1].trim(),
			background: hexes[0],
			text: hexes[1],
			primary: hexes[2],
			accent: hexes[3],
		}));
}

describe('design skills', () => {
	const cases: Array<[string, string]> = [
		['design-archetypes', DESIGN_ARCHETYPES],
		['frontend-design', FRONTEND_DESIGN],
		['web-design-guidelines', WEB_DESIGN_GUIDELINES],
	];

	it.each(cases)('%s parses and is named after its directory', (dir, raw) => {
		const parsed = parseSkillMarkdown(raw);
		expect(parsed).not.toBeNull();
		expect(parsed?.name).toBe(dir);
		expect(parsed?.description.length).toBeGreaterThan(40);
		expect(parsed?.body.length).toBeGreaterThan(200);
	});

	it('are all in the catalog the agent loads', async () => {
		const source = createThinkSkillSource();
		const catalog = await source.list();
		const names = catalog.map((skill) => skill.name);
		for (const [dir] of cases) expect(names).toContain(dir);
		expect(new Set(names).size).toBe(names.length);
	});
});

describe('design-archetypes palettes', () => {
	const directions = directionsIn(DESIGN_ARCHETYPES);

	it('lists a direction for every archetype', () => {
		expect(directions.length).toBeGreaterThanOrEqual(11);
	});

	it.each(directions.map((direction) => [direction.name, direction] as const))(
		'%s meets the contrast rules the skill states',
		(_name, d) => {
			expect(contrast(d.text, d.background)).toBeGreaterThanOrEqual(4.5);
			const label = Math.max(contrast('#FFFFFF', d.primary), contrast(d.background, d.primary));
			expect(label).toBeGreaterThanOrEqual(4.5);
			expect(contrast(d.accent, d.background)).toBeGreaterThanOrEqual(3);
		},
	);

	it('gives every direction its own palette, so two sites in one archetype do not look alike', () => {
		const palettes = directions.map((d) => [d.background, d.text, d.primary, d.accent].join(' '));
		expect(new Set(palettes).size).toBe(palettes.length);
	});

	it('does not name Inter, Roboto or Arial as a heading or body font', () => {
		const tableRows = DESIGN_ARCHETYPES.split('\n').filter((line) => line.startsWith('| ') && line.includes(' / '));
		for (const row of tableRows) expect(row).not.toMatch(/\b(Inter|Arial)\b|Roboto(?! Mono)/);
	});
});
