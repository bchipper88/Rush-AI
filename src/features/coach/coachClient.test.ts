import type { CoachChatRequest } from '../../../shared/coach';
import { mockCoachReply } from './mockCoach';

const baseContext = {
  name: 'Emma',
  schoolName: 'University of Alabama',
  region: 'south',
  season: 'fall' as const,
  rushYear: 2027,
  daysUntilRush: 90,
  priorities: ['sisterhood'],
  checklist: [
    { title: 'Register for recruitment', phase: 'register', dueLabel: 'By May 2027', done: true },
    { title: 'Find a rec writer for each chapter', phase: 'recs', dueLabel: 'By March 2027', done: false },
    { title: 'Run a social media audit', phase: 'social_media', dueLabel: 'By June 2027', done: false },
  ],
};

function requestWith(text: string): CoachChatRequest {
  return { messages: [{ role: 'user', text }], context: baseContext };
}

describe('mockCoachReply', () => {
  it('answers "what next" with real undone checklist items', () => {
    const res = mockCoachReply(requestWith('What should I work on next?'));
    expect(res.reply).toContain('Find a rec writer');
    expect(res.reply).not.toContain('Register for recruitment');
    expect(res.suggestions.length).toBeGreaterThan(0);
    expect(res.suggestions.length).toBeLessThanOrEqual(3);
  });

  it('celebrates when everything is done', () => {
    const allDone = {
      ...baseContext,
      checklist: baseContext.checklist.map((i) => ({ ...i, done: true })),
    };
    const res = mockCoachReply({
      messages: [{ role: 'user', text: 'what should i do next' }],
      context: allDone,
    });
    expect(res.reply.toLowerCase()).toContain('done');
  });

  it('routes topic keywords to topical guidance', () => {
    expect(mockCoachReply(requestWith('how do rec letters work?')).reply).toMatch(/alumnae/i);
    expect(mockCoachReply(requestWith('what should I wear?')).reply).toMatch(/open house/i);
    expect(mockCoachReply(requestWith('is suicide bidding bad?')).reply).toMatch(/MRABA/);
    expect(mockCoachReply(requestWith("i'm so nervous about getting cut")).reply).toMatch(
      /normal/i,
    );
  });

  it('is deterministic', () => {
    const a = mockCoachReply(requestWith('hello!'));
    const b = mockCoachReply(requestWith('hello!'));
    expect(a).toEqual(b);
  });
});

describe('sendCoachMessage', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;
  const originalFetch = global.fetch;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnv;
    global.fetch = originalFetch;
    jest.resetModules();
    jest.useRealTimers();
  });

  async function loadClient() {
    let mod: typeof import('./coachClient');
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('./coachClient');
    });
    return mod!;
  }

  it('uses the mock coach when no API URL is configured', async () => {
    process.env.EXPO_PUBLIC_API_URL = '';
    const { sendCoachMessage, isCoachMockMode } = await loadClient();
    expect(isCoachMockMode()).toBe(true);

    jest.useFakeTimers();
    const promise = sendCoachMessage(requestWith('hi'));
    jest.runAllTimers();
    const { source, response } = await promise;
    expect(source).toBe('mock');
    expect(response.reply.length).toBeGreaterThan(0);
  });

  it('POSTs to /api/coach and parses a valid reply', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: 'Focus on recs first.', suggestions: ['Why recs?'] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { sendCoachMessage } = await loadClient();
    const { source, response } = await sendCoachMessage(requestWith('what next?'));
    expect(source).toBe('claude');
    expect(response.reply).toBe('Focus on recs first.');
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8787/api/coach',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws CoachUnavailableError on failure and bad payloads', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787';
    const { sendCoachMessage, CoachUnavailableError } = await loadClient();

    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('down')) as unknown as typeof fetch;
    await expect(sendCoachMessage(requestWith('hi'))).rejects.toThrow(CoachUnavailableError);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ nope: true }),
    }) as unknown as typeof fetch;
    await expect(sendCoachMessage(requestWith('hi'))).rejects.toThrow(CoachUnavailableError);
  });
});
