// Turns the vendored shadcn themes (themes/shadcn-themes.css, MIT) into
// `[data-theme="<name>"]` presets for ui-kit.css. Each theme's own --radius is
// dropped so the `data-radius` presets in input.css stay in charge of shape.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(here, 'themes/shadcn-themes.css'), 'utf8');
const out = process.argv[2];

const css = source
	.replace(/^\s*--radius:[^;]*;\s*$/gm, '')
	.replace(/^\.dark \.theme-([a-z]+)\s*\{/gm, '.dark[data-theme="$1"],\n.dark [data-theme="$1"] {')
	.replace(/^\.theme-([a-z]+)\s*\{/gm, '[data-theme="$1"] {');

if (/\.theme-/.test(css)) throw new Error('Unconverted theme selector left in themes CSS');
fs.writeFileSync(out, `@layer base {\n${css}\n}\n`);
console.log(`Themes -> ${out}`);
