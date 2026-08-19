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

- **House Tracker** — track the chapters on your campus, log every round
  (stars, vibe tags, notes, invited-back status), and build your **Pref
  ranking** from your own data. The ranking weights later rounds more
  heavily and enforces the MRABA "maximize your options" rule, warning you
  before you leave a house off your list.
- **Practice Mode** — the AI role-plays a chapter member for a round you
  pick, then grades your side: warmth, curiosity, storytelling, poise, plus
  Five B's flags and specific fixes. Works offline with a scripted partner
  and heuristic scoring.
- **Streaks & Daily Focus** — a daily card with one task and one micro-tip
  (deterministic per day), a streak that forgives one missed day, and
  optional local reminders (daily nudge + 30/7/1-day countdown alerts).
- **Rush Week Mode** — within a week of recruitment, Home becomes a
  day-by-day agenda: today's round, what to wear, what to bring, and the
  one thing to remember.
- **Bid Day check-in** — after recruitment ends, the app asks how it went
  (bid / no bid / withdrew) so outcomes can inform future guidance.

**Age & the AI coach.** Onboarding collects a birth date (stored on-device
only; analytics sees a coarse bracket). `src/config/policy.ts` holds the
policy: `AGE_ENFORCEMENT` is `'soft'` today (age is recorded, nothing is
blocked). Flip it to `'hard'` and the conversational-AI surfaces — coach
chat and practice mode — are gated to 18+ automatically via `AgeGate`.

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

127 tests cover the checklist personalization engine, house ranking and the
maximize-options rule, streak math, daily-focus determinism, practice scoring
(including Five B's detection), age brackets and gating, the audit/coach
clients' mock-vs-real switching and error handling, seed-content schema
validation, and every server endpoint (with the Anthropic SDK mocked).

## Architecture

```
src/app/            Expo Router routes (onboarding flow, tabs, audit flow)
src/components/     Pink/white design system (DM Serif Display + Inter)
src/content/        Seed data: schools, articles, glossary, checklist templates
src/features/       Pure logic: checklist engine, house ranking, streaks,
                    daily focus, rush week, audit/coach/practice clients
src/state/          zustand + AsyncStorage stores (profile, checklist, audits)
shared/             Zod contracts shared by app and server (audit, coach chat)
server/             Hono proxy → Claude (vision + structured outputs):
                    POST /api/audit, /api/coach, /api/practice, /api/events
```
