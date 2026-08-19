import { serve } from '@hono/node-server';

import { app } from './app.ts';
import { getModel } from './claude.ts';

const port = Number(process.env.PORT ?? 8787);

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    'WARNING: ANTHROPIC_API_KEY is not set — /api/audit requests will fail. Copy .env.example to .env and add your key.',
  );
}

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Rush AI server listening on http://localhost:${info.port} (model: ${getModel()})`);
  console.log(
    'Point the app at this machine: set EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:' +
      info.port +
      ' in the project root .env',
  );
});
