import {
  AuditRequest,
  AuditResponse,
  AuditResponseSchema,
} from '../../../shared/audit';
import { mockAudit } from './mockAudit';

export class AuditUnavailableError extends Error {
  constructor(message = 'The AI audit service is unreachable right now.') {
    super(message);
    this.name = 'AuditUnavailableError';
    Object.setPrototypeOf(this, AuditUnavailableError.prototype);
  }
}

export interface StoredAuditResult extends AuditResponse {
  id: string;
  createdAt: string;
  source: 'claude' | 'mock';
  /** display metadata only — base64 image data is never persisted */
  itemsMeta: { id: string; kind: 'photo' | 'caption' | 'bio'; thumbnailUri?: string; text?: string }[];
}

export function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
}

export function isMockMode(): boolean {
  return getApiBaseUrl() === '';
}

const MOCK_DELAY_MS = 2500;
const REQUEST_TIMEOUT_MS = 60_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs an audit. With no EXPO_PUBLIC_API_URL configured, returns realistic
 * mocked results (the app stays fully demoable). With a URL, POSTs to the
 * backend proxy; failures throw AuditUnavailableError so the UI can offer
 * "Retry" or "Show demo results instead".
 */
export async function runAudit(
  request: AuditRequest,
): Promise<{ response: AuditResponse; source: 'claude' | 'mock' }> {
  if (isMockMode()) {
    await delay(MOCK_DELAY_MS);
    return { response: mockAudit(request), source: 'mock' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch {
    throw new AuditUnavailableError();
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new AuditUnavailableError(
      `The AI audit service returned an error (${res.status}). Try again in a moment.`,
    );
  }

  const json: unknown = await res.json().catch(() => {
    throw new AuditUnavailableError('The AI audit service returned an unreadable response.');
  });
  const parsed = AuditResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new AuditUnavailableError('The AI audit service returned an unexpected response.');
  }
  return { response: parsed.data, source: 'claude' };
}

/** Checks whether the configured backend is reachable ("AI connected" indicator). */
export async function checkHealth(): Promise<boolean> {
  if (isMockMode()) return false;
  try {
    const res = await fetch(`${getApiBaseUrl()}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
