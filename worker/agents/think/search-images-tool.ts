/**
 * `search_images` — searches Pexels for real, licensed stock photos matching a
 * keyword and returns direct, hotlinkable CDN URLs at several sizes. Lets the
 * agent ground a design in real photography (e.g. a hero or section image)
 * instead of defaulting to a decorative gradient when the subject calls for it.
 *
 * This runs inside the ThinkAgent DO and calls Pexels directly via `env` — no
 * SpaceDO round-trip, since the result is a hotlinked URL, not a file write.
 */
import { tool, type Tool } from 'ai';
import { z } from 'zod';

const PEXELS_SEARCH_URL = 'https://api.pexels.com/v1/search';

const DESCRIPTION = [
	'Search Pexels for real, licensed stock photos matching a keyword and return direct CDN image URLs at several sizes, ready to hotlink in <img> or CSS background-image.',
	'',
	"USE THIS to ground a design in real photography when the subject calls for it: a hero image, a section with people/places/products, a background photo. Query with concrete, specific terms from the brief (e.g. 'dentist smiling with patient', 'modern dental clinic interior') rather than generic terms (e.g. 'business').",
	'',
	"Pexels images don't require attribution, but photographer credit is returned for optional display. Not every design needs a photo — many strong heroes are typographic, illustrative, or data-driven; only call this when a real photograph is the right choice for the brief, not the reflexive default.",
	'',
	"OUTPUT is JSON: { query, results: [{ id, photographer, photographer_url, alt, width, height, src: { original, large2x, large, medium, small, portrait, landscape, tiny } }] }. Pick the smallest src size that still looks sharp at its usage size to keep page weight down (e.g. 'large2x' for a full-bleed hero, 'medium' for a card).",
].join('\n');

interface PexelsPhoto {
	id: number;
	width: number;
	height: number;
	photographer: string;
	photographer_url: string;
	alt: string | null;
	src: {
		original: string;
		large2x: string;
		large: string;
		medium: string;
		small: string;
		portrait: string;
		landscape: string;
		tiny: string;
	};
}

interface PexelsSearchResponse {
	photos: PexelsPhoto[];
	error?: string;
}

export function createSearchImagesTool(opts: { env: Env }): Tool {
	const { env } = opts;
	return tool({
		description: DESCRIPTION,
		inputSchema: z.object({
			query: z.string().describe('Specific, concrete search terms describing the photo subject.'),
			orientation: z
				.enum(['landscape', 'portrait', 'square'])
				.optional()
				.describe('Optional aspect-ratio filter. Use landscape for heroes/backgrounds, portrait for people/avatars.'),
			per_page: z.number().min(1).max(10).optional().describe('Number of results to return. Default 5, max 10.'),
		}),
		execute: async (args: { query: string; orientation?: 'landscape' | 'portrait' | 'square'; per_page?: number }) => {
			const apiKey = env.PEXELS_API_KEY;
			if (!apiKey) {
				return JSON.stringify({
					error:
						'Image search is not configured (missing PEXELS_API_KEY). Use a typographic, illustrative, or CSS-only treatment instead.',
				});
			}

			const url = new URL(PEXELS_SEARCH_URL);
			url.searchParams.set('query', args.query);
			url.searchParams.set('per_page', String(Math.min(Math.max(args.per_page ?? 5, 1), 10)));
			if (args.orientation) url.searchParams.set('orientation', args.orientation);

			let response: Response;
			try {
				response = await fetch(url.toString(), {
					headers: { Authorization: apiKey },
					signal: AbortSignal.timeout(10000),
				});
			} catch (e) {
				return JSON.stringify({ error: `Pexels request failed: ${e instanceof Error ? e.message : String(e)}` });
			}

			if (!response.ok) {
				return JSON.stringify({ error: `Pexels returned ${response.status}` });
			}

			const data: PexelsSearchResponse = await response.json();
			if (data.error) {
				return JSON.stringify({ error: `Pexels error: ${data.error}` });
			}

			return JSON.stringify(
				{
					query: args.query,
					results: (data.photos ?? []).map((p) => ({
						id: p.id,
						photographer: p.photographer,
						photographer_url: p.photographer_url,
						alt: p.alt || args.query,
						width: p.width,
						height: p.height,
						src: p.src,
					})),
				},
				null,
				2,
			);
		},
	});
}
