/**
 * `ask_questions` — lets the Think agent ask the user one or more clarifying
 * questions before it continues building. The tool itself is a no-op inside the
 * ThinkAgent DO: it echoes the questions back as JSON. The host behavior
 * (`ThinkCodingBehavior.translateChunk`) observes the tool output on the same
 * streaming channel used by `set_title` and `deploy_space`, and broadcasts it to
 * the frontend as a `conversation_response.tool` event. The frontend renders a
 * popup; the user's answers come back as the next user message.
 *
 * This tool is only registered for the Think agent.
 */
import { tool, type Tool } from 'ai';
import { z } from 'zod';

const DESCRIPTION = [
	'Ask the user one or more clarifying questions when the request is underspecified or ambiguous.',
	'',
	'Each question can provide predefined answer options, allow multiple selections, and/or allow a free-text custom answer. The user can also skip the popup entirely.',
	'',
	'Call this tool once with all the questions you need answered, then end your turn and wait for the user. Do not write or edit files until the scope is clear or the user tells you to proceed with your assumptions.',
].join('\n');

export type ClarifyingQuestion = {
	question: string;
	options?: string[];
	allow_multiple?: boolean;
	allow_custom?: boolean;
	about?: string;
};

const question = z.object({
	question: z.string().describe('The clarifying question to ask the user.'),
	options: z.array(z.string()).optional().describe('Predefined answer options the user can choose from.'),
	allow_multiple: z.boolean().optional().describe('When true, the user may select more than one predefined option.'),
	allow_custom: z.boolean().optional().describe('When true, the user may enter a free-text answer not in options.'),
});

/**
 * One question with two to four suggested answers, for a session an embedding
 * platform started: the platform relays it, so it must fit on a card.
 */
const singleQuestion = z.object({
	question: z.string().min(1).describe('The one clarifying question, in plain words.'),
	options: z.array(z.string().min(1)).min(2).max(4).describe('Two to four suggested answers.'),
	about: z.string().min(1).max(40).describe('What the question is about, in one or two words, e.g. "colours".'),
});

const SINGLE_DESCRIPTION = [
	'Ask exactly one clarifying question, with two to four suggested answers, when the answer would change the result a lot and nothing you were given points either way.',
	'',
	'Then end your turn and wait: the answer arrives as the next message. Do not write or edit files until it does.',
].join('\n');

export function createAskQuestionsTool(options: { oneAtATime?: boolean } = {}): Tool {
	if (options.oneAtATime) {
		return tool({
			description: SINGLE_DESCRIPTION,
			inputSchema: z.object({ questions: z.array(singleQuestion).length(1).describe('Exactly one question.') }),
			execute: async (args: { questions: ClarifyingQuestion[] }) => {
				const questions = Array.isArray(args.questions) ? args.questions.slice(0, 1) : [];
				return JSON.stringify({ ok: true, questions });
			},
		});
	}
	return tool({
		description: DESCRIPTION,
		inputSchema: z.object({
			questions: z.array(question).describe('One or more clarifying questions to present to the user.'),
		}),
		execute: async (args: { questions: ClarifyingQuestion[] }) => {
			const questions = Array.isArray(args.questions) ? args.questions : [];
			return JSON.stringify({ ok: true, questions });
		},
	});
}
