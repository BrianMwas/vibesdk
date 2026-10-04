// Generates worker/agents/think/ui-kit/catalog.ts from the kit build:
// - UI_BLOCKS: vendored shadcn/ui registry blocks (MIT) and the authored blocks
//   in ./blocks/*.jsx, converted to JSX that runs in a Think space (one
//   public/app.jsx, components from "./vendor/ui-kit.js", icons from
//   "lucide-react"), with imports split out so several blocks can be merged.
// - UI_KIT_EXPORTS, THEME_PRESETS, RADIUS_PRESETS and TAILWIND_RUNTIME_CONFIG,
//   read from the built kit and its config so the tools can never drift from it.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const blocksDir = path.join(here, 'blocks');
const outFile = path.join(here, '../../worker/agents/think/ui-kit/catalog.ts');
const kitFile = path.join(here, '../../worker/agents/think/ui-kit/ui-kit.js');

const BLOCKS = [
	{
		name: 'marketing-header',
		category: 'marketing',
		source: 'marketing-header.jsx',
		description: 'Sticky site header: brand, a few links on desktop, a Sheet slide-out menu on mobile, one call to action.',
	},
	{
		name: 'hero-split',
		category: 'marketing',
		source: 'hero-split.jsx',
		description: 'Hero with headline, supporting sentence and two actions beside an image (4:3).',
		notes: 'Set heroSplitImage to a search_images result, or drop the image column for a typographic hero.',
	},
	{
		name: 'hero-centered',
		category: 'marketing',
		source: 'hero-centered.jsx',
		description: 'Centered typographic hero: headline, supporting sentence, two actions.',
	},
	{
		name: 'feature-grid',
		category: 'marketing',
		source: 'feature-grid.jsx',
		description: 'Section header plus a responsive grid of features or services (icon, title, one sentence).',
	},
	{
		name: 'testimonials',
		category: 'marketing',
		source: 'testimonials.jsx',
		description: 'Muted band with three quote cards and attributed names.',
	},
	{
		name: 'pricing',
		category: 'marketing',
		source: 'pricing.jsx',
		description: 'Three plan cards with price, inclusions and a call to action; one plan highlighted.',
	},
	{
		name: 'faq',
		category: 'marketing',
		source: 'faq.jsx',
		description: 'Narrow centered FAQ using Accordion.',
	},
	{
		name: 'cta-band',
		category: 'marketing',
		source: 'cta-band.jsx',
		description: 'Primary-colored closing band: one line, one sentence, one action.',
	},
	{
		name: 'contact',
		category: 'marketing',
		source: 'contact.jsx',
		description: 'Two columns: contact details (address, hours, phone, email) and a validated form card (Input, Select, Textarea) that confirms with a toast.',
		notes: 'Render <Toaster /> once at the app root.',
	},
	{
		name: 'site-footer',
		category: 'marketing',
		source: 'site-footer.jsx',
		description: 'Footer with brand line, three link columns and a legal row.',
	},
	{
		name: 'sidebar-07',
		category: 'app',
		source: 'sidebar-07.json',
		description:
			'App shell (official shadcn block): sidebar that collapses to icons, workspace switcher, grouped navigation with collapsible sub-items, a secondary list, user menu, and a header with breadcrumb. Use for dashboards, portals, admin tools and any multi-section app.',
		notes:
			'Replace `data` with the app\'s real sections. Either render Sidebar07Page and swap its placeholder grid for your page, or compose <SidebarProvider><AppSidebar /><SidebarInset><AppHeader />…page…</SidebarInset></SidebarProvider> with the app-header block. Use either sidebar-07 or sidebar-01, not both.',
	},
	{
		name: 'sidebar-01',
		category: 'app',
		source: 'sidebar-01.json',
		description:
			'App shell (official shadcn block): simple sidebar with titled sections of links, a search field and a version switcher, plus a header with breadcrumb. Use for documentation-style or content-heavy apps.',
		notes: 'Replace `data` and the placeholder content inside SidebarInset. Use either sidebar-01 or sidebar-07, not both.',
	},
	{
		name: 'page-with-tabs',
		category: 'app',
		source: 'page-with-tabs.jsx',
		description:
			'App screen: PageHeader with actions, Tabs (overview / activity / documents), KPI StatCards, a 2:1 panel layout, an activity list and an EmptyState. Use for sub-views inside one area of an app — keep top-level areas in the sidebar.',
	},
	{
		name: 'app-header',
		category: 'app',
		source: 'app-header.jsx',
		description: 'Sticky app page header: sidebar toggle, breadcrumb (section / page) and optional actions. Put it first inside SidebarInset.',
		notes: 'Uses SidebarTrigger, so it must render inside a SidebarProvider.',
	},
	{
		name: 'dashboard-stats',
		category: 'app',
		source: 'dashboard-stats.jsx',
		description: 'Responsive row of four KPI StatCards with trend badges (1 → 2 → 4 columns).',
	},
	{
		name: 'data-table',
		category: 'app',
		source: 'data-table.jsx',
		description:
			'Records table in a card: search, status filter and "New" button toolbar, status badges, per-row DropdownMenu actions, empty row and pager. Calls onOpenRecord(row) from the row menu.',
		notes: 'Pair with record-sheet: keep the selected row in state and pass it to <RecordSheet record={...} open={...} onOpenChange={...} />.',
	},
	{
		name: 'record-sheet',
		category: 'app',
		source: 'record-sheet.jsx',
		description: 'Controlled right-side Sheet for viewing or editing one record: header, form fields, a Switch setting and a sticky footer.',
		notes: 'Render <Toaster /> once at the app root.',
	},
	{
		name: 'form-dialog',
		category: 'app',
		source: 'form-dialog.jsx',
		description: 'Dialog with a short create form, triggered by a "New item" button.',
		notes: 'Render <Toaster /> once at the app root.',
	},
	{
		name: 'confirm-dialog',
		category: 'app',
		source: 'confirm-dialog.jsx',
		description: 'Destructive confirmation using AlertDialog.',
		notes: 'Render <Toaster /> once at the app root.',
	},
	{
		name: 'settings-page',
		category: 'app',
		source: 'settings-page.jsx',
		description: 'Settings screen: PageHeader, Tabs, a profile form card and a notification list of labelled Switch rows.',
		notes: 'Render <Toaster /> once at the app root.',
	},
	{
		name: 'login-03',
		category: 'auth',
		source: 'login-03.json',
		description: 'Sign-in page (official shadcn block): centered card on a muted background with social buttons and an email/password form.',
	},
];

const KIT_SPECIFIER = /^@\/(registry\/new-york\/(ui|lib)\/|components\/ui\/|lib\/utils$)|^\.\/vendor\/ui-kit\.js$/;
const LOCAL_BLOCK_SPECIFIER = /^@\/registry\/new-york\/blocks\//;
const IMPORT_RE = /^import\s+([\s\S]*?)\s+from\s+["']([^"']+)["'];?[ \t]*$/gm;
const DECLARATION_RE = /^(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/gm;

function parseNamed(clause) {
	const braces = clause.match(/\{([\s\S]*)\}/);
	if (!braces) return [];
	return braces[1]
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s && !s.startsWith('type '));
}

function pascal(name) {
	return name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
}

function sourceFiles(block) {
	const file = path.join(blocksDir, block.source);
	if (block.source.endsWith('.jsx')) return [{ path: block.source, content: fs.readFileSync(file, 'utf8') }];
	const registry = JSON.parse(fs.readFileSync(file, 'utf8'));
	const files = registry.files.filter((f) => /\.tsx?$/.test(f.path));
	// Components first, the page that composes them last.
	return [...files.filter((f) => !f.path.endsWith('page.tsx')), ...files.filter((f) => f.path.endsWith('page.tsx'))];
}

async function convert(block, kitExports, lucideExports) {
	const imports = { react: new Set(), reactNamespace: false, lucide: new Set(), kit: new Set() };
	const parts = [];
	let defaultExport = null;

	for (const file of sourceFiles(block)) {
		defaultExport = file.content.match(/^export\s+default\s+function\s+([A-Z]\w*)/m)?.[1] ?? defaultExport;
		const body = file.content.replace(/^["']use client["'];?\s*$/m, '').replace(IMPORT_RE, (_, clause, spec) => {
			if (KIT_SPECIFIER.test(spec)) parseNamed(clause).forEach((n) => imports.kit.add(n));
			else if (spec === 'lucide-react') parseNamed(clause).forEach((n) => imports.lucide.add(n));
			else if (spec === 'react') parseNamed(clause).forEach((n) => imports.react.add(n));
			else if (!LOCAL_BLOCK_SPECIFIER.test(spec)) throw new Error(`${block.name} (${file.path}): unsupported import "${spec}"`);
			// Block-local components are concatenated into the same snippet.
			return '';
		});
		const { code } = await esbuild.transform(body, { loader: file.path.endsWith('.jsx') ? 'jsx' : 'tsx', jsx: 'preserve' });
		parts.push(
			code
				.replace(/^export\s+default\s+/gm, '')
				.replace(/^export\s+(?=(async\s+)?(function|const|let|class)\b)/gm, '')
				.replace(/^export\s*\{[^}]*\};?\s*$/gm, '')
				.trim(),
		);
	}

	// Registry demo assets (e.g. "/avatars/shadcn.jpg") don't exist in a space and
	// would 404; Avatar falls back to initials without them.
	let body = parts.join('\n\n').replace(/"\/avatars\/[^"]*"/g, '""');
	imports.reactNamespace = /\bReact\./.test(body);

	// Registry pages are all called `Page`; give each a unique name so blocks merge.
	let entry = defaultExport;
	if (entry === 'Page') {
		entry = `${pascal(block.name)}Page`;
		body = body.replace(/^function Page\(/m, `function ${entry}(`);
	}
	entry ??= [...body.matchAll(/^function ([A-Z]\w*)\(/gm)].map((m) => m[1]).join(', ');

	// An icon named like a JS global or a kit export (lucide's `Map`, `Badge`)
	// would shadow it for the whole app.jsx; use lucide's `…Icon` alias instead.
	for (const name of [...imports.lucide]) {
		if (!(name in globalThis) && !kitExports.has(name)) continue;
		const alias = `${name}Icon`;
		if (!lucideExports.has(alias)) throw new Error(`${block.name}: no ${alias} alias for colliding icon ${name}`);
		body = body.replace(new RegExp(`(?<![\\w"'.])${name}(?![\\w"'])`, 'g'), alias);
		imports.lucide.delete(name);
		imports.lucide.add(alias);
	}

	for (const name of imports.kit) {
		if (!kitExports.has(name)) throw new Error(`${block.name}: "${name}" is not exported by ui-kit.js`);
	}
	for (const name of imports.lucide) {
		if (!lucideExports.has(name)) throw new Error(`${block.name}: "${name}" is not exported by lucide-react`);
	}

	return {
		name: block.name,
		category: block.category,
		description: block.description,
		notes: block.notes ?? '',
		entry,
		imports: {
			reactNamespace: imports.reactNamespace,
			react: [...imports.react].sort(),
			lucide: [...imports.lucide].sort(),
			kit: [...imports.kit].sort(),
		},
		declarations: [...body.matchAll(DECLARATION_RE)].map((m) => m[1]),
		body: `${body}\n`,
	};
}

function themePresets() {
	const css = fs.readFileSync(path.join(here, 'themes/shadcn-themes.css'), 'utf8');
	return [...new Set([...css.matchAll(/^\.theme-([a-z]+)\s*\{/gm)].map((m) => m[1]))];
}

function radiusPresets() {
	const css = fs.readFileSync(path.join(here, 'input.css'), 'utf8');
	return [...css.matchAll(/\[data-radius="([a-z]+)"\]\s*\{\s*--radius:\s*([^;]+);/g)].map((m) => ({ name: m[1], value: m[2].trim() }));
}

function tailwindRuntimeConfig() {
	const { darkMode, theme } = require('./tailwind.config.cjs');
	const config = { darkMode, corePlugins: { preflight: false }, theme: { extend: theme.extend } };
	return `tailwind.config = ${JSON.stringify(config, null, 2)};`;
}

const kitExports = new Set(Object.keys(await import(kitFile)));
const lucideExports = new Set(Object.keys(await import('lucide-react')));
const blocks = [];
for (const block of BLOCKS) blocks.push(await convert(block, kitExports, lucideExports));

const owners = new Map();
for (const block of blocks) {
	for (const name of block.declarations) owners.set(name, [...(owners.get(name) ?? []), block.name]);
}
const clashes = [...owners].filter(([, names]) => names.length > 1);

const ts = `// Generated by scripts/think-ui-kit/build-catalog.mjs. Do not hand-edit.
// Blocks: shadcn/ui registry blocks (MIT, https://ui.shadcn.com/blocks) and the
// authored blocks in scripts/think-ui-kit/blocks/*.jsx.

export type UiBlockCategory = 'marketing' | 'app' | 'auth';

export interface UiBlock {
	name: string;
	category: UiBlockCategory;
	description: string;
	notes: string;
	/** Top-level component(s) the block renders. */
	entry: string;
	imports: { reactNamespace: boolean; react: string[]; lucide: string[]; kit: string[] };
	/** Top-level names the block declares; two merged blocks must not share one. */
	declarations: string[];
	body: string;
}

export const UI_KIT_EXPORTS: readonly string[] = ${JSON.stringify([...kitExports].sort())};

export const THEME_PRESETS: readonly string[] = ${JSON.stringify(themePresets())};

export const RADIUS_PRESETS: readonly { name: string; value: string }[] = ${JSON.stringify(radiusPresets())};

export const TAILWIND_RUNTIME_CONFIG = ${JSON.stringify(tailwindRuntimeConfig())};

export const UI_BLOCKS: readonly UiBlock[] = ${JSON.stringify(blocks, null, '\t')};
`;
fs.writeFileSync(outFile, ts);

console.log(`Catalog -> ${path.relative(process.cwd(), outFile)}`);
console.log(`  ${kitExports.size} kit exports, themes: ${themePresets().join(' ')}, radius: ${radiusPresets().map((r) => r.name).join(' ')}`);
for (const b of blocks) console.log(`  ${b.name.padEnd(17)} entry ${b.entry}`);
if (clashes.length) console.log(`  name clashes (blocks that cannot be merged together): ${clashes.map(([n, bs]) => `${n} [${bs.join(', ')}]`).join('; ')}`);
