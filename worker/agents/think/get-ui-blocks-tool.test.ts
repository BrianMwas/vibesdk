import { describe, expect, it } from 'vitest';
import { createGetUiBlocksTool } from './get-ui-blocks-tool';
import { UI_BLOCKS, UI_KIT_EXPORTS } from './ui-kit/catalog';

async function getBlocks(names: string[]) {
	const tool = createGetUiBlocksTool();
	return JSON.parse((await tool.execute!({ names }, { toolCallId: 'x', messages: [] })) as string);
}

function importLine(code: string, from: string): string[] {
	const line = code.split('\n').find((l) => l.endsWith(`from "${from}";`) && l.startsWith('import {'));
	return line ? line.slice(line.indexOf('{') + 1, line.indexOf('}')).split(',').map((s) => s.trim()) : [];
}

describe('get_ui_blocks tool', () => {
	it('only references kit exports that the compiled kit actually has', () => {
		for (const block of UI_BLOCKS) {
			for (const name of block.imports.kit) expect(UI_KIT_EXPORTS, `${block.name} -> ${name}`).toContain(name);
		}
	});

	it('merges a full landing page into one snippet with each import declared once', async () => {
		const names = ['marketing-header', 'hero-split', 'feature-grid', 'pricing', 'faq', 'contact', 'site-footer'];
		const result = await getBlocks(names);

		expect(result.ok).toBe(true);
		expect(result.entries.map((e: { block: string }) => e.block)).toEqual(names);
		const kit = importLine(result.code, './vendor/ui-kit.js');
		expect(new Set(kit).size).toBe(kit.length);
		expect(kit).toEqual(expect.arrayContaining(['Container', 'Section', 'Button', 'Sheet', 'Accordion']));
		expect(result.code.match(/from "\.\/vendor\/ui-kit\.js"/g)).toHaveLength(1);
		expect(result.code).not.toMatch(/@\/(registry|components)/);
	});

	it('merges the motion imports of animated blocks into one line', async () => {
		const result = await getBlocks(['marketing-header', 'hero-workflow', 'process-steps', 'stats-band', 'faq-topics', 'site-footer']);

		expect(result.ok).toBe(true);
		const motion = importLine(result.code, 'motion/react');
		expect(motion).toEqual(expect.arrayContaining(['AnimatePresence', 'MotionConfig', 'animate', 'motion', 'useInView']));
		expect(new Set(motion).size).toBe(motion.length);
		expect(result.code.match(/from "motion\/react"/g)).toHaveLength(1);
		expect((result.next_steps as string[]).join('\n')).toContain('scaffold_ui_kit maps it');
	});

	it('only mentions motion for blocks that animate', async () => {
		const result = await getBlocks(['contact']);
		expect(result.code).not.toContain('motion/react');
		expect((result.next_steps as string[]).join('\n')).not.toContain('motion/react');
	});

	it('merges every marketing block into one page without name clashes', async () => {
		const names = UI_BLOCKS.filter((block) => block.category === 'marketing').map((block) => block.name);
		const result = await getBlocks(names);
		expect(result.ok).toBe(true);
		expect(result.entries).toHaveLength(names.length);
	});

	it('imports Toaster whenever a block calls toast()', async () => {
		const result = await getBlocks(['contact']);
		expect(importLine(result.code, './vendor/ui-kit.js')).toEqual(expect.arrayContaining(['toast', 'Toaster']));
	});

	it('converts official registry blocks into uniquely named, self-contained JSX', async () => {
		const result = await getBlocks(['sidebar-07', 'app-header', 'data-table', 'record-sheet']);
		expect(result.ok).toBe(true);
		expect(result.code).toContain('function Sidebar07Page(');
		expect(result.code).not.toMatch(/^function Page\(/m);
		expect(result.code).not.toContain('/avatars/');
		// lucide's `Map` icon would shadow the JS Map global inside app.jsx.
		expect(importLine(result.code, 'lucide-react')).toContain('MapIcon');
		expect(importLine(result.code, 'lucide-react')).not.toContain('Map');
	});

	it('refuses alternative blocks that declare the same names', async () => {
		const result = await getBlocks(['sidebar-07', 'sidebar-01']);
		expect(result.ok).toBe(false);
		expect(result.error).toContain('AppSidebar');
	});
});
