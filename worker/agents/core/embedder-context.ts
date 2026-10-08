import { z } from 'zod';

/**
 * Context supplied by the platform that embeds this builder (for example a CRM
 * that builds a customer's website from facts it already holds). It is typed and
 * bounded because it arrives over the API and ends up in the system prompt, the
 * workspace and a deployed Worker's name.
 */

export const EMBEDDER_LIMITS = {
	instructionsChars: 30_000,
	requiredSkills: 8,
	seedFiles: 20,
	seedPathChars: 200,
	seedBytes: 200_000,
	callbackUrlChars: 2_000,
} as const;

const SKILL_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/;
const DEPLOYMENT_NAME = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/;
const RESERVED_SEED_ROOTS: readonly string[] = ['.git', '.think'];

const byteLength = (text: string): number => new TextEncoder().encode(text).length;

/** A relative path that stays inside the workspace and avoids the agent's own state. */
export function isSafeSeedPath(path: string): boolean {
	if (path.length === 0 || path.length > EMBEDDER_LIMITS.seedPathChars) return false;
	if (path.startsWith('/') || path.includes('\\') || path.includes('\0')) return false;
	const segments = path.split('/');
	if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) return false;
	return !RESERVED_SEED_ROOTS.includes(segments[0]);
}

const seedFilesSchema = z.record(z.string(), z.string()).superRefine((files, ctx) => {
	const paths = Object.keys(files);
	if (paths.length > EMBEDDER_LIMITS.seedFiles) {
		ctx.addIssue({ code: 'custom', message: `At most ${EMBEDDER_LIMITS.seedFiles} seed files are allowed` });
	}
	for (const path of paths) {
		if (!isSafeSeedPath(path)) ctx.addIssue({ code: 'custom', message: `Unsafe seed file path: ${path}` });
	}
	const bytes = paths.reduce((total, path) => total + byteLength(files[path]), 0);
	if (bytes > EMBEDDER_LIMITS.seedBytes) {
		ctx.addIssue({ code: 'custom', message: `Seed files exceed ${EMBEDDER_LIMITS.seedBytes} bytes` });
	}
});

export const embedderContextSchema = z
	.object({
		/** Appended to the Think system prompt. Written by the embedding platform. */
		instructions: z.string().min(1).max(EMBEDDER_LIMITS.instructionsChars).refine((text) => !text.includes('\0'), 'No NUL characters'),
		/** Skills the agent must load before writing any file. */
		requiredSkills: z
			.array(z.string().regex(SKILL_NAME))
			.max(EMBEDDER_LIMITS.requiredSkills)
			.refine((names) => new Set(names).size === names.length, 'Skill names must be unique')
			.optional(),
		/** Files written into the workspace before the first turn. */
		seedFiles: seedFilesSchema.optional(),
		/** Fixed name for the deployed Worker, so the embedder can route to it. */
		deploymentName: z.string().regex(DEPLOYMENT_NAME).optional(),
		/**
		 * Where progress is posted, signed with EMBEDDER_WEBHOOK_SECRET, so a
		 * platform with no WebSocket open still sees the build, the preview and
		 * the publish happen. See embedder-events.ts.
		 */
		callbackUrl: z
			.string()
			.max(EMBEDDER_LIMITS.callbackUrlChars)
			.refine(isCallbackUrl, 'callbackUrl must be an https URL without credentials')
			.optional(),
		/** Start building as soon as the session exists, without waiting for a WebSocket client to ask. */
		autoStart: z.boolean().optional(),
	})
	.strict();

function isCallbackUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && url.username === '' && url.password === '';
	} catch {
		return false;
	}
}

export type EmbedderContext = z.infer<typeof embedderContextSchema>;

/** What the agent keeps after the seed files are written. */
export type StoredEmbedderContext = Omit<EmbedderContext, 'seedFiles'>;

export type EmbedderContextResult =
	| { ok: true; value: EmbedderContext }
	| { ok: false; error: string };

export function parseEmbedderContext(input: unknown): EmbedderContextResult {
	const parsed = embedderContextSchema.safeParse(input);
	if (parsed.success) return { ok: true, value: parsed.data };
	const issue = parsed.error.issues[0];
	const where = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
	return { ok: false, error: `Invalid embedderContext. ${where}${issue.message}` };
}

export function toStoredContext(context: EmbedderContext): StoredEmbedderContext {
	const { seedFiles: _seedFiles, ...stored } = context;
	return stored;
}

/**
 * Setting a deployment name lets a caller choose which Worker in the shared
 * dispatch namespace is overwritten, and a callback URL makes this Worker post
 * to an address of the caller's choosing, so only the platform's own account
 * may set either.
 */
export function mayChooseDeploymentName(userId: string, allowlist: string | undefined): boolean {
	return (allowlist ?? '')
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean)
		.includes(userId);
}

/**
 * How an embedded session asks. The platform answers on its owner's behalf, and
 * passes on only what it cannot work out, so each question must be one it can
 * answer from a short list.
 */
export const EMBEDDED_CLARIFY_STEPS: readonly string[] = [
	'## Questions',
	'The platform that started this session answers your questions for its user, and asks the user only what it cannot work out. Decide from the files it seeded and its instructions first: state any assumption you make in one line and carry on building.',
	'Ask only when the answer would change the site a lot and nothing in those facts points either way. Then:',
	'1. Call `ask_questions` with exactly one question, in plain words, with two to four suggested answers and a one or two word `about` (e.g. "colours", "pages", "main button").',
	'2. End your turn. Do not write or edit files until the answer arrives as the next message.',
	'Never ask about a fact you could take from the seeded files, and never ask several questions at once.',
];

/** The block appended to the system prompt. */
export function renderEmbedderPrompt(context: StoredEmbedderContext): string {
	const instructions = context.instructions.replace(/<\/embedder-instructions>/gi, '<\\/embedder-instructions>');
	const lines = [
		'## Context from the platform that started this session',
		'The platform supplied the instructions below. They are authoritative on facts and design constraints; where they conflict with the user request on either, they win.',
		'<embedder-instructions>',
		instructions,
		'</embedder-instructions>',
	];
	if (context.requiredSkills && context.requiredSkills.length > 0) {
		lines.push(
			'',
			`Before writing any file, load these skills with the skill tool, in this order: ${context.requiredSkills.join(', ')}.`,
		);
	}
	return lines.join('\n');
}
