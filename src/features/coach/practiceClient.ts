import {
  PracticeRequest,
  PracticeResponse,
  PracticeResponseSchema,
} from '../../../shared/practice';
import { mockPractice } from './practiceMock';

export class PracticeUnavailableError extends Error {
  constructor(message = 'Practice mode is unreachable right now.') {
    super(message);
    this.name = 'PracticeUnavailableError';
    Object.setPrototypeOf(this, PracticeUnavailableError.prototype);
  }
}

function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
}

export function isPracticeMockMode(): boolean {
  return getApiBaseUrl() === '';
}

const MOCK_DELAY_MS = 900;
const REQUEST_TIMEOUT_MS = 60_000;

export async function runPracticeTurn(
  request: PracticeRequest,
): Promise<{ response: PracticeResponse; source: 'claude' | 'mock' }> {
  if (isPracticeMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { response: mockPractice(request), source: 'mock' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/practice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch {
    throw new PracticeUnavailableError();
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new PracticeUnavailableError(
      `Practice mode hit an error (${res.status}). Try again in a moment.`,
    );
  }

  const json: unknown = await res.json().catch(() => {
    throw new PracticeUnavailableError('Practice mode sent back an unreadable reply.');
  });
  const parsed = PracticeResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new PracticeUnavailableError('Practice mode sent back an unexpected reply.');
  }
  return { response: parsed.data, source: 'claude' };
}
