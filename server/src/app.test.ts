import type { AuditResponse } from '../../shared/audit.ts';

const mockParse = jest.fn();

jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    // defer the mockParse reference to call time — the class is instantiated
    // at module load, before the const above is initialized
    default: class MockAnthropic {
      messages = { parse: (...args: unknown[]) => mockParse(...args) };
    },
  };
});

jest.mock('@anthropic-ai/sdk/helpers/zod', () => ({
  __esModule: true,
  zodOutputFormat: (schema: unknown) => ({ type: 'zod', schema }),
}));

// import after mocks so claude.ts picks up the mocked SDK
import { app } from './app.ts';

const validRequest = {
  items: [
    { id: 'p1', kind: 'photo', base64: 'abc', mediaType: 'image/jpeg' },
    { id: 'b1', kind: 'bio', text: 'bama 2027' },
  ],
};

const claudeResult: AuditResponse = {
  overallScore: 77,
  summary: 'Nearly rush-ready.',
  cleanupActions: ['Archive the party photo'],
  verdicts: [
    { itemId: 'p1', verdict: 'archive', flags: ['alcohol_party'], reasons: ['Party setting'] },
    { itemId: 'b1', verdict: 'keep', flags: ['none'], reasons: ['Clean bio'] },
  ],
};

describe('server app', () => {
  beforeEach(() => {
    mockParse.mockReset();
  });

  it('GET /health reports ok and the model', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(typeof body.model).toBe('string');
  });

  it('POST /api/audit returns 400 on invalid body', async () => {
    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [] }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/audit returns 400 on non-JSON body', async () => {
    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/audit maps a successful Claude parse through', async () => {
    mockParse.mockResolvedValue({ stop_reason: 'end_turn', parsed_output: claudeResult });

    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validRequest),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.overallScore).toBe(77);
    expect(body.verdicts).toHaveLength(2);
    expect(mockParse).toHaveBeenCalledTimes(1);
  });

  it('POST /api/audit returns 502 when parsed_output is null', async () => {
    mockParse.mockResolvedValue({ stop_reason: 'end_turn', parsed_output: null });
    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validRequest),
    });
    expect(res.status).toBe(502);
  });

  it('POST /api/audit returns 502 with a friendly message on refusal', async () => {
    mockParse.mockResolvedValue({ stop_reason: 'refusal', parsed_output: null });
    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validRequest),
    });
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/declined/i);
  });

  it('POST /api/audit returns 502 when the SDK throws', async () => {
    mockParse.mockRejectedValue(new Error('upstream boom'));
    const res = await app.request('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validRequest),
    });
    expect(res.status).toBe(502);
  });
});
