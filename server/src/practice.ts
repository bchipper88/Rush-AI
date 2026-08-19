import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import {
  PracticeRequest,
  PracticeResponse,
  PracticeResponseSchema,
} from '../../shared/practice.ts';
import { ClaudeAuditError, getModel } from './claude.ts';
import { buildPracticeMessages, buildPracticeSystemPrompt } from './practicePrompt.ts';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

export async function runPractice(request: PracticeRequest): Promise<PracticeResponse> {
  const response = await client.messages.parse({
    model: getModel(),
    max_tokens: 16000,
    system: buildPracticeSystemPrompt(request),
    messages: buildPracticeMessages(request),
    output_config: {
      format: zodOutputFormat(PracticeResponseSchema),
    },
  });

  if (response.stop_reason === 'refusal') {
    throw new ClaudeAuditError(
      'The practice partner stepped away from that one. Try a different response.',
    );
  }
  if (!response.parsed_output) {
    throw new ClaudeAuditError('Practice mode returned an unparseable reply. Please retry.');
  }
  return PracticeResponseSchema.parse(response.parsed_output);
}
