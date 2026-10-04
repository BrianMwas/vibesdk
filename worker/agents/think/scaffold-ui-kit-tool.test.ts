import { describe, expect, it, vi } from 'vitest';
import { createScaffoldUiKitTool } from './scaffold-ui-kit-tool';
import { THEME_PRESETS, UI_KIT_EXPORTS } from './ui-kit/catalog';
import UI_KIT_JS from './ui-kit/ui-kit.js?raw';
import UI_KIT_CSS from './ui-kit/ui-kit.css.js?raw';

function memoryWorkspace(initial: Record<string, string> = {}) {
	const files = new Map(Object.entries(initial));
	return {
		files,
		ops: {
			readFile: vi.fn(async (path: string) => files.get(path) ?? null),
			writeFile: vi.fn(async (path: string, content: string) => {
				files.set(path, content);
			}),
		},
	};
}

async function run(
	ops: ReturnType<typeof memoryWorkspace>['ops'],
	args: { title?: string; theme?: string; radius?: string; mode?: 'light' | 'dark' } = {},
) {
	const tool = createScaffoldUiKitTool({ ops });
	return JSON.parse((await tool.execute!(args, { toolCallId: 'x', messages: [] })) as string);
}

describe('scaffold_ui_kit tool', () => {
	it('writes the kit and the starter shell into an empty space', async () => {
		const ws = memoryWorkspace();
		const result = await run(ws.ops, { title: 'Kimathi & Co <Advocates>' });

		expect(ws.files.get('public/vendor/ui-kit.js')).toBe(UI_KIT_JS);
		expect(ws.files.get('public/vendor/ui-kit.css')).toBe(UI_KIT_CSS);
		expect(result.written).toEqual([
			'public/vendor/ui-kit.js',
			'public/vendor/ui-kit.css',
			'public/index.html',
			'public/styles.css',
			'wrangler.json',
		]);
		expect(result.kept_existing).toEqual([]);

		const html = ws.files.get('public/index.html')!;
		expect(html).toContain('<title>Kimathi &amp; Co &lt;Advocates&gt;</title>');
		expect(html.indexOf('/vendor/ui-kit.css')).toBeLessThan(html.indexOf('/styles.css'));
		for (const specifier of ['"react"', '"react/jsx-runtime"', '"react-dom"', '"react-dom/client"']) {
			expect(html).toContain(specifier);
		}
		expect(html).toContain('runtime: "automatic"');
		expect(html).toContain('data-presets="react-auto" src="/app.jsx"');

		expect(JSON.parse(ws.files.get('wrangler.json')!).assets.directory).toBe('./public');
	});

	it('never overwrites existing starter files but always refreshes the kit', async () => {
		const ws = memoryWorkspace({
			'public/index.html': '<html>custom</html>',
			'public/styles.css': ':root{}',
			'wrangler.json': '{}',
			'public/vendor/ui-kit.js': 'stale',
		});
		const result = await run(ws.ops);

		expect(ws.files.get('public/index.html')).toBe('<html>custom</html>');
		expect(ws.files.get('public/styles.css')).toBe(':root{}');
		expect(ws.files.get('wrangler.json')).toBe('{}');
		expect(ws.files.get('public/vendor/ui-kit.js')).toBe(UI_KIT_JS);
		expect(result.kept_existing).toEqual(['public/index.html', 'public/styles.css', 'wrangler.json']);
		expect(result.warning).toContain('public/index.html already existed');
	});

	it('tells the model the import path and the HSL token format', async () => {
		const result = await run(memoryWorkspace().ops);
		const steps = (result.next_steps as string[]).join('\n');
		expect(steps).toContain('"./vendor/ui-kit.js"');
		expect(steps).toContain('bare HSL components');
	});

	it('bundles real components as named ES module exports with no leftover CJS requires', async () => {
		const kit = await import('./ui-kit/ui-kit.js');
		// React components are either plain functions or `forwardRef` objects.
		const isComponent = (v: unknown) => typeof v === 'function' || typeof v === 'object';
		expect(isComponent(kit.Button)).toBe(true);
		expect(isComponent(kit.Dialog)).toBe(true);
		expect(isComponent(kit.Sidebar)).toBe(true);
		expect(typeof kit.Toaster).toBe('function');
		expect(UI_KIT_JS).not.toMatch(/\brequire\(/);
	});

	it('compiles the theme tokens the frontend-design skill tells the model to override', () => {
		for (const token of ['--background', '--primary', '--radius', '--border']) {
			expect(UI_KIT_CSS).toContain(token);
		}
	});

	it('writes theme, radius and mode presets onto <html> in a new shell', async () => {
		const ws = memoryWorkspace();
		await run(ws.ops, { title: 'Site', theme: 'green', radius: 'sharp', mode: 'dark' });
		expect(ws.files.get('public/index.html')).toContain(
			'<html lang="en" data-theme="green" data-radius="sharp" class="dark">',
		);
	});

	it('restyles an existing page by rewriting only its <html> tag', async () => {
		const ws = memoryWorkspace();
		await run(ws.ops, { title: 'Site', theme: 'green', radius: 'sharp' });
		const before = ws.files.get('public/index.html')!;
		await run(ws.ops, { radius: 'large' });
		const after = ws.files.get('public/index.html')!;
		expect(after).toContain('<html lang="en" data-theme="green" data-radius="large">');
		expect(after.replace(/<html\b[^>]*>/, '')).toBe(before.replace(/<html\b[^>]*>/, ''));
	});

	it('ships every theme preset with a dark variant and scales radii from --radius', () => {
		for (const theme of THEME_PRESETS) {
			expect(UI_KIT_CSS).toContain(`[data-theme=${theme}]`);
			expect(UI_KIT_CSS).toContain(`.dark[data-theme=${theme}]`);
		}
		expect(UI_KIT_CSS).toContain('.dark{--background:');
		expect(UI_KIT_CSS).toContain('[data-radius=sharp]{--radius:0rem}');
		expect(UI_KIT_CSS).toContain('.rounded-xl{border-radius:calc(var(--radius)*1.5)}');
	});

	it('exports the layout primitives used by the blocks', async () => {
		const kit = await import('./ui-kit/ui-kit.js');
		for (const name of ['Container', 'Section', 'Stack', 'Inline', 'Grid', 'SectionHeader', 'PageHeader', 'StatCard', 'EmptyState', 'cn']) {
			expect(UI_KIT_EXPORTS).toContain(name);
			expect(name in kit).toBe(true);
		}
	});
});
