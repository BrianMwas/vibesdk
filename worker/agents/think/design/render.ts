/**
 * Turns a design direction into what the build starts from: `public/styles.css`
 * (fonts, every kit token, heading type), `design.json` (the direction itself,
 * in the shape an embedder supplies) and the system-prompt block that tells
 * the builder the design is decided.
 */
import { toHslComponents } from './color';
import { DESIGN_FILE_PATH, type DesignDirection } from './direction';
import { fontStack, fontsHref } from './fonts';
import { paletteTokens } from './palettes';

export const STYLES_CSS_PATH = 'public/styles.css';

/** Marks where the decided design ends; page styles go below it. */
export const PAGE_STYLES_MARKER = '/* ── Page styles: add your own below this line ── */';

export function renderStylesCss(direction: DesignDirection): string {
	const { tokens } = paletteTokens(direction.palette.colors);
	const { heading, body } = direction.fonts;
	const tokenLines = Object.entries(tokens).map(([name, hex]) => `\t${name}: ${toHslComponents(hex)};`);
	return `@import url('${fontsHref(direction.fonts)}');

/*
 * Design direction, decided before the build (see design.json): palette
 * "${direction.palette.name}", ${heading.family} with ${body.family}.
 * Change it only when the user asks for a different look, and then update
 * design.json too. Token values are bare HSL components read as hsl(var(--token)).
 * --highlight is reserved for the page's one signature element.
 */
:root,
:root.dark {
${tokenLines.join('\n')}
	--font-heading: ${fontStack(heading)};
	--font-body: ${fontStack(body)};
}

body {
	font-family: var(--font-body);
	background-color: hsl(var(--background));
	color: hsl(var(--foreground));
}

h1, h2, h3, h4 {
	font-family: var(--font-heading);
	font-weight: ${heading.weights[0]};
	letter-spacing: ${direction.fonts.headingTracking}em;${direction.fonts.uppercaseHeadings ? '\n\ttext-transform: uppercase;' : ''}
}

.bg-highlight { background-color: hsl(var(--highlight)); color: hsl(var(--highlight-foreground)); }
.text-highlight { color: hsl(var(--highlight)); }
.border-highlight { border-color: hsl(var(--highlight)); }

${PAGE_STYLES_MARKER}
`;
}

/** `design.json`, written in the shape `parseDesignInput` reads, so it round-trips. */
export function renderDesignJson(direction: DesignDirection): string {
	const palette = direction.palette.id === 'custom' ? { name: direction.palette.name, colors: direction.palette.colors } : direction.palette.id;
	return `${JSON.stringify(
		{
			kind: direction.kind,
			...(direction.sections ? { sections: direction.sections } : {}),
			palette,
			fonts: direction.fonts.id,
			radius: direction.radius,
			...(direction.signature ? { signature: direction.signature } : {}),
		},
		null,
		2,
	)}\n`;
}

export function designSeedFiles(direction: DesignDirection): Record<string, string> {
	return { [DESIGN_FILE_PATH]: renderDesignJson(direction), [STYLES_CSS_PATH]: renderStylesCss(direction) };
}

/**
 * The "Frontend standard" steps when the design is decided: the builder's
 * choices are content, imagery and the signature element, not the look.
 */
export function renderDesignSteps(direction: DesignDirection): string[] {
	const { heading, body } = direction.fonts;
	const steps = [
		'## Design direction (decided before this session)',
		`The look of this ${direction.kind} was chosen for this brief and is already in the workspace: \`public/styles.css\` holds the palette "${direction.palette.name}" (${direction.mode}) as tokens, loads ${heading.family} for headings and ${body.family} for body text, and \`design.json\` records the choice. Keep it. Your craft goes into the content, imagery, hierarchy and the signature element. Change the look only if the user explicitly asks for a different one, and then update \`public/styles.css\` and \`design.json\` together.`,
		'',
		'## Frontend standard (required)',
		'In the first building turn, before writing any frontend file:',
		`1. Call \`activate_skill\` for \`frontend-design\`, \`cloudflare-bundler-apps\` and \`no-ai-design-slop\`${direction.kind === 'website' ? ', and `frontend-design-landing-page`' : ', and `frontend-design-saas`'}. Where they ask you to choose a palette or typefaces, use the decided ones.`,
		`2. Call \`scaffold_ui_kit\` with the site name as \`title\`, \`radius\` "${direction.radius}" and \`mode\` "${direction.mode}", and no \`theme\`. It keeps the existing \`public/styles.css\`. Do not edit the tokens or fonts in it; add page styles below the "Page styles" line.`,
	];
	if (direction.sections) {
		steps.push(
			`3. Call \`get_ui_blocks\` once with exactly these sections, in this order: ${direction.sections.join(', ')}. Build \`public/app.jsx\` from the returned code. Do not add, drop or reorder sections. Replace every placeholder with the real content.`,
		);
	} else {
		steps.push(
			'3. Call `get_ui_blocks` once with every section the page needs, in order, and build `public/app.jsx` from the returned code. Replace every placeholder with the real content.',
		);
	}
	steps.push(
		'4. Keep the structure: layout comes from `Section`, `Container`, `Stack`, `Grid`, `Inline`, `SectionHeader` and `PageHeader`, not hand-picked padding or widths; menus, dialogs, sheets, tabs and form controls come from the kit, not divs; colours use token classes (`bg-primary`, `text-muted-foreground`, `bg-secondary`), never hex; icons come from `lucide-react`, never emoji.',
		direction.signature
			? `5. Signature element: ${direction.signature} Make it the page's one memorable moment, and use the highlight colour (\`bg-highlight\`, \`text-highlight\`, \`border-highlight\`) for it and nowhere else.`
			: '5. Give the page one memorable element tied to this business, and use the highlight colour (`bg-highlight`, `text-highlight`, `border-highlight`) for it and nowhere else.',
		'6. Keep the first screen uncluttered: one headline, one supporting sentence, at most two actions. Hours, address, phone numbers, badges and trust points belong further down or in the footer.',
		'7. Before the final `deploy_space` of a building turn, activate `audit-ai-design-slop`, list each issue it finds in what you built, and fix them before deploying.',
		'On later turns, skills you already activated in this conversation stay in effect.',
	);
	return steps;
}
