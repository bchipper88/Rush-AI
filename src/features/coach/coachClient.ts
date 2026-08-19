import {
  CoachChatRequest,
  CoachChatResponse,
  CoachChatResponseSchema,
  CoachContext,
} from '../../../shared/coach';
import { buildChecklist, resolveRushAnchor, resolveSchool, schoolSeason } from '@/features/checklist/buildChecklist';
import { daysUntil } from '@/lib/dates';
import type { UserProfile } from '@/types';

import { houseSummaryForCoach, TrackedHouse } from '@/features/houses/houseUtils';
import { mockCoachReply } from './mockCoach';

export class CoachUnavailableError extends Error {
  constructor(message = 'The coach is unreachable right now.') {
    super(message);
    this.name = 'CoachUnavailableError';
    Object.setPrototypeOf(this, CoachUnavailableError.prototype);
  }
}

function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
}

export function isCoachMockMode(): boolean {
  return getApiBaseUrl() === '';
}

const MOCK_DELAY_MS = 1200;
const REQUEST_TIMEOUT_MS = 60_000;

export function buildCoachContext(
  profile: UserProfile,
  done: Record<string, boolean>,
  houses: TrackedHouse[] = [],
): CoachContext {
  const school = resolveSchool(profile);
  const anchor = resolveRushAnchor(profile, school);
  const items = buildChecklist(profile, school);
  const schoolName =
    profile.customSchoolName && profile.schoolId === 'custom'
      ? profile.customSchoolName
      : school.name;

  return {
    name: profile.name,
    schoolName,
    region: school.region,
    season: profile.rushSeason ?? schoolSeason(school),
    rushYear: profile.rushYear,
    targetDate: profile.targetDate,
    daysUntilRush: daysUntil(anchor),
    priorities: profile.priorities,
    gpa: profile.gpa,
    houses: houses.length > 0 ? houseSummaryForCoach(houses) : undefined,
    checklist: items.map((i) => ({
      title: i.title,
      phase: i.phase,
      dueLabel: i.dueLabel,
      done: !!done[i.id],
    })),
  };
}

export async function sendCoachMessage(
  request: CoachChatRequest,
): Promise<{ response: CoachChatResponse; source: 'claude' | 'mock' }> {
  if (isCoachMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return { response: mockCoachReply(request), source: 'mock' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}/api/coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
  } catch {
    throw new CoachUnavailableError();
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new CoachUnavailableError(
      `The coach hit an error (${res.status}). Try again in a moment.`,
    );
  }

  const json: unknown = await res.json().catch(() => {
    throw new CoachUnavailableError('The coach sent back an unreadable reply.');
  });
  const parsed = CoachChatResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new CoachUnavailableError('The coach sent back an unexpected reply.');
  }
  return { response: parsed.data, source: 'claude' };
}
