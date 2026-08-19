import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';

import { AuditRequestSchema } from '../../shared/audit.ts';
import { ClaudeAuditError, getModel, runClaudeAudit } from './claude.ts';

export const app = new Hono();

app.get('/health', (c) => c.json({ ok: true, model: getModel() }));

app.post(
  '/api/audit',
  bodyLimit({
    maxSize: 25 * 1024 * 1024,
    onError: (c) => c.json({ error: 'Payload too large — send fewer or smaller photos.' }, 413),
  }),
  async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: 'Request body must be JSON.' }, 400);
    }

    const parsed = AuditRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: 'Invalid audit request.', issues: parsed.error.issues }, 400);
    }

    try {
      const result = await runClaudeAudit(parsed.data);
      return c.json(result);
    } catch (err) {
      const message =
        err instanceof ClaudeAuditError
          ? err.message
          : 'The AI audit failed upstream. Please retry.';
      console.error('audit failed:', err);
      return c.json({ error: message }, 502);
    }
  },
);
