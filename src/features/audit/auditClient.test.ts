import type { AuditRequest } from '../../../shared/audit';
import { mockAudit } from './mockAudit';

const request: AuditRequest = {
  items: [
    { id: 'p1', kind: 'photo', base64: 'abc', mediaType: 'image/jpeg' },
    { id: 'c1', kind: 'caption', text: 'lake days with my girls' },
  ],
  context: { schoolName: 'University of Alabama', region: 'south' },
};

describe('runAudit', () => {
  const originalEnv = process.env.EXPO_PUBLIC_API_URL;
  const originalFetch = global.fetch;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnv;
    global.fetch = originalFetch;
    jest.resetModules();
    jest.useRealTimers();
  });

  async function loadClient() {
    let mod: typeof import('./auditClient');
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      mod = require('./auditClient');
    });
    return mod!;
  }

  it('returns mock results when no API URL is configured', async () => {
    process.env.EXPO_PUBLIC_API_URL = '';
    const { runAudit, isMockMode } = await loadClient();
    expect(isMockMode()).toBe(true);

    jest.useFakeTimers();
    const promise = runAudit(request);
    jest.runAllTimers();
    const { response, source } = await promise;

    expect(source).toBe('mock');
    expect(response.verdicts).toHaveLength(2);
    expect(response.verdicts.map((v) => v.itemId)).toEqual(['p1', 'c1']);
    expect(response.overallScore).toBeGreaterThanOrEqual(0);
    expect(response.overallScore).toBeLessThanOrEqual(100);
  });

  it('POSTs to the configured backend and parses a valid response', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787/';
    const backendResponse = {
      overallScore: 82,
      summary: 'Looking good.',
      cleanupActions: ['Archive one photo'],
      verdicts: [
        { itemId: 'p1', verdict: 'keep', flags: ['none'], reasons: ['Nice photo'] },
        { itemId: 'c1', verdict: 'edit', flags: ['negative_tone'], reasons: ['Rewrite'] },
      ],
    };
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => backendResponse,
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { runAudit } = await loadClient();
    const { response, source } = await runAudit(request);

    expect(source).toBe('claude');
    expect(response.overallScore).toBe(82);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8787/api/audit',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws AuditUnavailableError on network failure', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787';
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    const { runAudit, AuditUnavailableError } = await loadClient();
    await expect(runAudit(request)).rejects.toThrow(AuditUnavailableError);
  });

  it('throws AuditUnavailableError on a 5xx response', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
    }) as unknown as typeof fetch;

    const { runAudit, AuditUnavailableError } = await loadClient();
    await expect(runAudit(request)).rejects.toThrow(AuditUnavailableError);
  });

  it('throws AuditUnavailableError when the response fails schema validation', async () => {
    process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8787';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ nonsense: true }),
    }) as unknown as typeof fetch;

    const { runAudit, AuditUnavailableError } = await loadClient();
    await expect(runAudit(request)).rejects.toThrow(AuditUnavailableError);
  });
});

describe('mockAudit', () => {
  it('is deterministic and returns one verdict per item', () => {
    const a = mockAudit(request);
    const b = mockAudit(request);
    expect(a).toEqual(b);
    expect(a.verdicts.map((v) => v.itemId)).toEqual(['p1', 'c1']);
  });
});
