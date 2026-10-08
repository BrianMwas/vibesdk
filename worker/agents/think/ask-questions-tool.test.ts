import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import { createAskQuestionsTool } from './ask-questions-tool';

const schemaOf = (oneAtATime: boolean) =>
	(createAskQuestionsTool({ oneAtATime }) as unknown as { inputSchema: z.ZodType }).inputSchema;

describe('createAskQuestionsTool', () => {
	it('lets a session the user drives ask several open questions', () => {
		const parsed = schemaOf(false).safeParse({ questions: [{ question: 'Who is it for?' }, { question: 'Which pages?', allow_custom: true }] });
		expect(parsed.success).toBe(true);
	});

	it('takes exactly one question with two to four answers in an embedded session', () => {
		const schema = schemaOf(true);
		const one = { question: 'Which colours?', options: ['Brand terracotta', 'Calm greens'], about: 'colours' };
		expect(schema.safeParse({ questions: [one] }).success).toBe(true);
		expect(schema.safeParse({ questions: [one, one] }).success).toBe(false);
		expect(schema.safeParse({ questions: [{ ...one, options: ['Only one'] }] }).success).toBe(false);
		expect(schema.safeParse({ questions: [{ ...one, options: ['a', 'b', 'c', 'd', 'e'] }] }).success).toBe(false);
		expect(schema.safeParse({ questions: [{ question: 'Which colours?', options: ['a', 'b'] }] }).success).toBe(false);
	});
});
