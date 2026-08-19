import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';

import { AuditRequest, AuditResponse, AuditResponseSchema } from '../../shared/audit.ts';
import { AUDIT_SYSTEM_PROMPT, buildUserContent } from './prompt.ts';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY

export function getModel(): string {
  return process.env.CLAUDE_MODEL ?? 'claude-opus-5';
}

export class ClaudeAuditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClaudeAuditError';
    Object.setPrototypeOf(this, ClaudeAuditError.prototype);
  }
}

export async function runClaudeAudit(request: AuditRequest): Promise<AuditResponse> {
  const response = await client.messages.parse({
    model: getModel(),
    max_tokens: 16000,
    system: AUDIT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserContent(request) }],
    output_config: {
      format: zodOutputFormat(AuditResponseSchema),
    },
  });

  if (response.stop_reason === 'refusal') {
    throw new ClaudeAuditError(
      'The AI declined to review one of these items. Try removing the most sensitive photo and running again.',
    );
  }
  if (!response.parsed_output) {
    throw new ClaudeAuditError('The AI returned an unparseable result. Please retry.');
  }
  return AuditResponseSchema.parse(response.parsed_output);
}
