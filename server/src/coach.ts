import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import {
  CoachChatRequest,
  CoachChatResponse,
  CoachChatResponseSchema,
} from '../../shared/coach.ts';
import { ClaudeAuditError, getModel } from './claude.ts';
import { buildCoachMessages, COACH_SYSTEM_PROMPT } from './coachPrompt.ts';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

export async function runCoachChat(request: CoachChatRequest): Promise<CoachChatResponse> {
  const response = await client.messages.parse({
    model: getModel(),
    max_tokens: 16000,
    system: COACH_SYSTEM_PROMPT,
    messages: buildCoachMessages(request),
    output_config: {
      format: zodOutputFormat(CoachChatResponseSchema),
    },
  });

  if (response.stop_reason === 'refusal') {
    throw new ClaudeAuditError(
      'The coach declined to answer that one. Try rephrasing your question.',
    );
  }
  if (!response.parsed_output) {
    throw new ClaudeAuditError('The coach returned an unparseable reply. Please retry.');
  }
  return CoachChatResponseSchema.parse(response.parsed_output);
}
