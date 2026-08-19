# Rush AI 🎀

An iOS app that helps women prepare for sorority recruitment — the tactics rush
coaches charge $500–$12,000 for, personalized to your school and powered by
Claude.

## What's inside

- **Onboarding** — name, school (searchable list of 27 major rush schools with
  real metadata: fall vs. deferred recruitment, rec-letter policy, cost tier),
  priorities, and rush year. Everything downstream personalizes from this.
- **Personalized game plan** — a dated, phase-grouped prep checklist generated
  from your school: SEC schools get rec-letter tasks and an August timeline;
  deferred schools (Cornell, Northwestern, SMU…) get January timelines with
  no rec tasks and fall-semester GPA focus.
- **Coach** — 18 guides distilled from rush-coach tactics: how rounds work, the
  Five B's, elevator pitches, MRABA/bid-matching strategy (why maximizing
  options wins), rec letters by region, outfit guides with budget tiers, cost
  breakdowns, drop resilience, COB fallbacks — plus a searchable glossary.
- **AI Social Media Audit** — pick up to 12 photos and paste your bio/captions;
  Claude reviews them the way a chapter's recruitment committee would and
  returns keep / edit / archive / delete verdicts with reasons, an overall
  readiness score, and cleanup actions. 9+ photos triggers **grid mode** with
  cohesion/ordering feedback. In a dev build (`npx expo run:ios`) you can also
  **share posts straight from Instagram/TikTok** into an audit via the iOS
  share sheet (share extensions don't run inside Expo Go).
- **Coach chat** — an AI big-sister coach who knows your profile and checklist:
  ask "what should I work on next?" and she answers from your actual undone
  tasks and due dates. Guardrailed (no bid guarantees, no tier gossip). In demo
  mode a rule-based coach answers from your real checklist.

- **Bid Day check-in** — after recruitment ends, the app asks how it went
  (bid / no bid / withdrew) so outcomes can inform future guidance.

Profile data is stored locally on-device; no accounts. With user consent
(on by default, toggle in Profile → Data & privacy), anonymous usage events
(e.g. "audit completed", school/season from onboarding, rush outcome — never
names, photos, or messages) are sent to your server's `POST /api/events` and
appended to `server/data/events.ndjson` for product analytics.

## Run it (Mac)

```bash
git clone https://github.com/bchipper88/Rush-AI.git
cd Rush-AI
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your iPhone (free), or press `i` for the
iOS simulator, or run `npx expo run:ios` for a native dev build. No EAS or paid
services needed.

Out of the box the app runs in **demo mode**: the AI audit returns realistic
sample results, so every screen works with zero setup.

## Enable real Claude analysis

The app never holds an API key — a tiny proxy server does.

```bash
cd server
npm install
cp .env.example .env     # paste your ANTHROPIC_API_KEY into .env
npm run dev              # starts on http://localhost:8787
```

Then point the app at your Mac (phone and Mac on the same Wi-Fi):

```bash
cd ..
cp .env.example .env     # set EXPO_PUBLIC_API_URL=http://<your-Mac-LAN-IP>:8787
npx expo start -c
```

The Profile tab shows **🟢 AI connected** when the app can reach the server.
Default model is `claude-opus-5`; override with `CLAUDE_MODEL` in `server/.env`.

> The proxy has no auth — it's meant for local/LAN use. Add a shared-secret
> header before exposing it to the internet.

## Development

```bash
npm run verify      # typecheck (app + server) + lint + all tests
npm run typecheck
npm run lint
npm test
npm run server      # run the proxy from the repo root
```

Tests cover the checklist personalization engine, the audit client's mock/real
switching and error handling, seed-content schema validation, and the server's
endpoints (with the Anthropic SDK mocked).

## Architecture

```
src/app/            Expo Router routes (onboarding flow, tabs, audit flow)
src/components/     Pink/white design system (DM Serif Display + Inter)
src/content/        Seed data: schools, articles, glossary, checklist templates
src/features/       Pure logic: checklist engine, audit client, filters
src/state/          zustand + AsyncStorage stores (profile, checklist, audits)
shared/             Zod contracts shared by app and server (audit, coach chat)
server/             Hono proxy: POST /api/audit, POST /api/coach → Claude
                    (vision + structured outputs)
```
