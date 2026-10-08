/**
 * Colour arithmetic for design tokens: hex parsing, mixing, WCAG contrast and
 * the bare-HSL form the UI kit reads (`hsl(var(--token))`).
 */

export interface Rgb {
	r: number;
	g: number;
	b: number;
}

const HEX = /^#([0-9a-f]{6})$/i;

export function isHex(value: string): boolean {
	return HEX.test(value);
}

export function parseHex(hex: string): Rgb {
	const match = HEX.exec(hex);
	if (!match) throw new Error(`Not a six-digit hex colour: ${hex}`);
	const value = Number.parseInt(match[1], 16);
	return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function toHex({ r, g, b }: Rgb): string {
	return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

/** `amount` of the way from `from` to `to`, in sRGB. */
export function mix(from: string, to: string, amount: number): string {
	const a = parseHex(from);
	const b = parseHex(to);
	return toHex({ r: a.r + (b.r - a.r) * amount, g: a.g + (b.g - a.g) * amount, b: a.b + (b.b - a.b) * amount });
}

function relativeLuminance(hex: string): number {
	const linear = (channel: number) => {
		const value = channel / 255;
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
	};
	const { r, g, b } = parseHex(hex);
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG 2 contrast ratio, from 1 to 21. */
export function contrast(a: string, b: string): number {
	const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
}

export function isDark(hex: string): boolean {
	return relativeLuminance(hex) < 0.18;
}

/** The candidate with the most contrast against `background`. */
export function mostReadable(background: string, candidates: readonly string[]): string {
	return candidates.reduce((best, candidate) => (contrast(background, candidate) > contrast(background, best) ? candidate : best));
}

/** Bare HSL components ("221 39% 11%"), the form the kit's tokens use. */
export function toHslComponents(hex: string): string {
	const { r, g, b } = parseHex(hex);
	const [red, green, blue] = [r / 255, g / 255, b / 255];
	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const lightness = (max + min) / 2;
	let hue = 0;
	let saturation = 0;
	if (max !== min) {
		const delta = max - min;
		saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
		if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
		else if (max === green) hue = (blue - red) / delta + 2;
		else hue = (red - green) / delta + 4;
		hue *= 60;
	}
	const round = (value: number) => Math.round(value * 10) / 10;
	return `${round(hue)} ${round(saturation * 100)}% ${round(lightness * 100)}%`;
}
