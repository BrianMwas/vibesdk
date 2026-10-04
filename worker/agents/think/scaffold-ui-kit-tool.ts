/**
 * `scaffold_ui_kit` — sets up the standard Think frontend: a precompiled
 * shadcn/ui component kit (Radix UI primitives + Tailwind, MIT licensed) with
 * layout primitives and theme/radius presets, and, when missing, a React page
 * shell, page stylesheet and static wrangler.json.
 *
 * The kit is compiled offline (see scripts/think-ui-kit/build.sh) because the
 * space preview pipeline ships `public/` assets byte-for-byte: no JSX
 * transform, no Tailwind/PostCSS build step. The shell supplies React via an
 * import map, compiles `app.jsx` in the browser, and runs Tailwind's runtime so
 * any utility class the page uses exists.
 *
 * Writes directly via SpaceDO ops rather than asking the model to reproduce
 * ~300KB of bundled source or a shell that is easy to get subtly wrong.
 */
import { tool, type Tool } from 'ai';
import { z } from 'zod';
import type { SpaceWorkspaceOps } from './space-workspace-ops';
import { RADIUS_PRESETS, TAILWIND_RUNTIME_CONFIG, THEME_PRESETS, UI_KIT_EXPORTS } from './ui-kit/catalog';
import UI_KIT_JS from './ui-kit/ui-kit.js?raw';
// Source copy is `.css.js`, not `.css`: under @cloudflare/vitest-pool-workers
// (and seemingly independent of any wrangler rule), a `.css?raw` import
// silently resolves to an empty string, while `.js?raw` resolves real
// content in both the test pool and real `wrangler deploy`. The file written
// into the generated app is still named `ui-kit.css` (see UI_KIT_CSS_PATH
// below) — only this in-repo copy needs the extra extension. Regenerate both
// via scripts/think-ui-kit/build.sh.
import UI_KIT_CSS from './ui-kit/ui-kit.css.js?raw';
import { DESIGN_FILE_PATH, parseDesignInput } from './design/direction';

const UI_KIT_JS_PATH = 'public/vendor/ui-kit.js';
const UI_KIT_CSS_PATH = 'public/vendor/ui-kit.css';
const INDEX_HTML_PATH = 'public/index.html';
const STYLES_CSS_PATH = 'public/styles.css';
const WRANGLER_JSON_PATH = 'wrangler.json';

const THEME_TOKENS = [
	'--background', '--foreground', '--card', '--card-foreground', '--popover', '--popover-foreground',
	'--primary', '--primary-foreground', '--secondary', '--secondary-foreground', '--muted',
	'--muted-foreground', '--accent', '--accent-foreground', '--destructive', '--destructive-foreground',
	'--border', '--input', '--ring',
];

// Animated blocks from get_ui_blocks import "motion/react".
const MOTION_IMPORT = '"motion/react": "https://esm.sh/motion@14.0.0/react?external=react,react-dom"';

const THEME_NAMES = ['default', ...THEME_PRESETS] as [string, ...string[]];
const RADIUS_NAMES = RADIUS_PRESETS.map((preset) => preset.name) as [string, ...string[]];

interface Appearance {
	theme?: string;
	radius?: string;
	mode?: 'light' | 'dark';
}

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHtmlTag({ theme, radius, mode }: Appearance): string {
	const attributes = ['lang="en"'];
	if (theme && theme !== 'default') attributes.push(`data-theme="${theme}"`);
	attributes.push(`data-radius="${radius ?? 'default'}"`);
	if (mode === 'dark') attributes.push('class="dark"');
	return `<html ${attributes.join(' ')}>`;
}

// `@babel/standalone@7` defaults the React preset to the classic runtime and
// `data-presets` cannot take preset options, so a named automatic-runtime
// preset is registered before Babel transforms the page. Tailwind's runtime
// has preflight off (ui-kit.css already ships it). Verified in headless Chrome
// under a /space/<name>/preview/<branch>/ prefix.
function renderIndexHtml(title: string, appearance: Appearance): string {
	return `<!doctype html>
${renderHtmlTag(appearance)}
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="/vendor/ui-kit.css">
<link rel="stylesheet" href="/styles.css">
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react/jsx-runtime": "https://esm.sh/react@18.3.1/jsx-runtime",
    "react-dom": "https://esm.sh/react-dom@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "lucide-react": "https://esm.sh/lucide-react@0.525.0?external=react",
    ${MOTION_IMPORT}
  }
}
</script>
<script src="https://cdn.tailwindcss.com/3.4.17"></script>
<script>
${TAILWIND_RUNTIME_CONFIG}
</script>
<script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
<script>Babel.registerPreset("react-auto", { presets: [[Babel.availablePresets.react, { runtime: "automatic" }]] });</script>
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-type="module" data-presets="react-auto" src="/app.jsx"></script>
</body>
</html>
`;
}

/** Adds motion/react to an import map written before the animated blocks existed, or null when nothing changes. */
function withMotionImport(html: string): string | null {
	if (html.includes('"motion/react"')) return null;
	const imports = html.match(/<script type="importmap">\s*\{\s*"imports"\s*:\s*\{/);
	if (!imports || imports.index === undefined) return null;
	const at = imports.index + imports[0].length;
	return `${html.slice(0, at)}\n    ${MOTION_IMPORT},${html.slice(at)}`;
}

const STYLES_CSS = `/*
 * Page styles. Loaded after /vendor/ui-kit.css, so rules here win.
 *
 * Palette: pick a preset with data-theme on <html>, or set the brief's own
 * palette here under :root (overrides the preset). Token values are bare HSL
 * components ("221 39% 11%"), NOT hex or hsl(): the kit reads them as
 * hsl(var(--token)). Shape: use data-radius on <html>, not --radius.
 */
`;

const WRANGLER_JSON = `${JSON.stringify(
	{
		compatibility_date: '2025-04-01',
		assets: {
			directory: './public',
			html_handling: 'auto-trailing-slash',
			not_found_handling: 'single-page-application',
		},
	},
	null,
	2,
)}\n`;

const DESCRIPTION = [
	'Set up the standard frontend for this space: a precompiled shadcn/ui component kit (Radix UI primitives, MIT licensed) with layout primitives and theme presets, plus a verified React page shell with Tailwind that needs no build step.',
	'',
	'CALL THIS FIRST for any site or app with a UI, before writing frontend files; then call get_ui_blocks for the page structure. Call it again with theme/radius/mode to change the look of an existing page (only the <html> tag is updated). Idempotent: kit files are always refreshed; index.html, styles.css and wrangler.json are only created when missing.',
	'',
	`theme: ${THEME_NAMES.join(', ')} (light and dark variants each; "default" is neutral). radius: ${RADIUS_PRESETS.map((p) => `${p.name} (${p.value})`).join(', ')}. mode: light or dark.`,
	'',
	`Exports (import by name from "./vendor/ui-kit.js"): ${UI_KIT_EXPORTS.join(', ')}.`,
].join('\n');

const NEXT_STEPS = [
	'Start from blocks: call get_ui_blocks with the blocks for this page (e.g. marketing-header, hero-split, feature-grid, contact, site-footer for a business site; sidebar-07 + page-with-tabs + data-table + record-sheet for an app) and paste the returned code into public/app.jsx, then replace the placeholder content with the real content.',
	'Write everything in public/app.jsx (JSX is compiled in the browser). Mount with: import { createRoot } from "react-dom/client"; createRoot(document.getElementById("root")).render(<App />); Keep all JSX in that one file: any .jsx file it imports is loaded raw and fails to parse.',
	'Import kit components with a RELATIVE path: from "./vendor/ui-kit.js" (root-relative "/vendor/..." is not rewritten inside JS and breaks in the preview). Icons: import { Scale, Calendar } from "lucide-react" — never emoji.',
	'Structure and spacing come from the layout primitives, not hand-picked values: Section (vertical rhythm, tone="muted" for alternating bands) > Container (max width + gutters) > Stack / Grid / Inline; SectionHeader for section titles; PageHeader, StatCard and EmptyState in apps.',
	'Tailwind utilities all work (the shell runs Tailwind). Use the token colors — bg-background, bg-muted, text-muted-foreground, bg-primary, text-primary-foreground, border, bg-card — never hex values like bg-[#2E5A44], so the theme and dark mode apply everywhere. Use rounded-sm/md/lg/xl only; they follow data-radius.',
	`Palette: either a data-theme preset or the brief's own palette under :root in public/styles.css (wins over the preset): ${THEME_TOKENS.join(', ')}. Values are bare HSL components like "221 39% 11%", never hex or hsl(...).`,
	"ui-kit.css includes Tailwind's reset: headings render at body size, lists have no markers. Size headings with utilities (text-4xl font-semibold tracking-tight) or in styles.css; load fonts with an @import in styles.css and set them on body / h1–h3.",
	'Wrap anything using Tooltip in <TooltipProvider>. Render <Toaster /> once if you use toast().',
	'Console warnings "You are using the in-browser Babel transformer" and "cdn.tailwindcss.com should not be used in production" are expected for this setup; do not try to fix them.',
];

/** Radius and mode from a decided design (`design.json`) when the call leaves them out. */
async function withDesignDefaults<T extends Appearance>(ops: Pick<SpaceWorkspaceOps, 'readFile'>, args: T): Promise<T> {
	if (args.radius && args.mode) return args;
	const design = await ops.readFile(DESIGN_FILE_PATH);
	if (design === null) return args;
	const parsed = parseDesignInput(design);
	if (!parsed.ok) return args;
	return { ...args, radius: args.radius ?? parsed.direction.radius, mode: args.mode ?? parsed.direction.mode };
}

export function createScaffoldUiKitTool(opts: {
	ops: Pick<SpaceWorkspaceOps, 'writeFile' | 'readFile'>;
}): Tool {
	const { ops } = opts;
	return tool({
		description: DESCRIPTION,
		inputSchema: z.object({
			title: z.string().optional().describe('Page <title> for a newly created index.html (the site or product name).'),
			theme: z.enum(THEME_NAMES).optional().describe('Color preset. Omit to keep the current one; override it in styles.css for a custom palette.'),
			radius: z.enum(RADIUS_NAMES).optional().describe('Corner shape: sharp for square, small, default, large, round.'),
			mode: z.enum(['light', 'dark']).optional().describe('Light or dark color scheme.'),
		}),
		execute: async (requested: { title?: string } & Appearance) => {
			const args = await withDesignDefaults(ops, requested);
			await ops.writeFile(UI_KIT_JS_PATH, UI_KIT_JS);
			await ops.writeFile(UI_KIT_CSS_PATH, UI_KIT_CSS);
			const written = [UI_KIT_JS_PATH, UI_KIT_CSS_PATH];
			const kept: string[] = [];
			const appearanceRequested = Boolean(args.theme || args.radius || args.mode);

			const existingIndex = await ops.readFile(INDEX_HTML_PATH);
			if (existingIndex === null) {
				await ops.writeFile(INDEX_HTML_PATH, renderIndexHtml(args.title?.trim() || 'App', args));
				written.push(INDEX_HTML_PATH);
			} else {
				let updated = existingIndex;
				const current = existingIndex.match(/<html\b[^>]*>/)?.[0];
				if (appearanceRequested && current) {
					const merged: Appearance = {
						theme: args.theme ?? current.match(/data-theme="([^"]+)"/)?.[1],
						radius: args.radius ?? current.match(/data-radius="([^"]+)"/)?.[1],
						mode: args.mode ?? (/class="[^"]*\bdark\b/.test(current) ? 'dark' : 'light'),
					};
					updated = updated.replace(current, renderHtmlTag(merged));
				}
				updated = withMotionImport(updated) ?? updated;
				if (updated !== existingIndex) {
					await ops.writeFile(INDEX_HTML_PATH, updated);
					written.push(INDEX_HTML_PATH);
				} else {
					kept.push(INDEX_HTML_PATH);
				}
			}

			for (const [path, content] of [
				[STYLES_CSS_PATH, STYLES_CSS],
				[WRANGLER_JSON_PATH, WRANGLER_JSON],
			] as const) {
				if ((await ops.readFile(path)) !== null) {
					kept.push(path);
					continue;
				}
				await ops.writeFile(path, content);
				written.push(path);
			}

			return JSON.stringify({
				ok: true,
				written,
				kept_existing: kept,
				...(kept.includes(INDEX_HTML_PATH) && !existingIndex?.includes('cdn.tailwindcss.com')
					? {
							warning:
								'public/index.html already existed and was not changed. It must link /vendor/ui-kit.css before your own CSS, define an import map for react, react/jsx-runtime, react-dom, react-dom/client, lucide-react and motion/react, load the Tailwind runtime, and compile JSX with the automatic runtime — compare it with the shell this tool creates in an empty space.',
						}
					: {}),
				next_steps: NEXT_STEPS,
			});
		},
	});
}
