import { AGE_ENFORCEMENT, MINIMUM_AGE } from '@/config/policy';
import type { UserProfile } from '@/types';

export type AgeBracket = 'under_18' | '18_19' | '20_21' | '22_plus';

/** Whole years elapsed, handling leap-day birthdays the way birthdays work. */
export function ageFromBirthDate(birthDate: string, now: Date = new Date()): number | null {
  const [y, m, d] = birthDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  let age = now.getFullYear() - y;
  const hadBirthday =
    now.getMonth() + 1 > m || (now.getMonth() + 1 === m && now.getDate() >= d);
  if (!hadBirthday) age -= 1;
  return age < 0 ? null : age;
}

/** Coarse bracket — this is all that ever reaches analytics (never the DOB). */
export function ageBracket(age: number): AgeBracket {
  if (age < 18) return 'under_18';
  if (age <= 19) return '18_19';
  if (age <= 21) return '20_21';
  return '22_plus';
}

export function profileAge(
  profile: Pick<UserProfile, 'birthDate'> | null,
  now: Date = new Date(),
): number | null {
  if (!profile?.birthDate) return null;
  return ageFromBirthDate(profile.birthDate, now);
}

/** Unknown age is treated as meeting the minimum (we never had it, e.g. legacy users). */
export function meetsMinimumAge(
  profile: Pick<UserProfile, 'birthDate'> | null,
  now: Date = new Date(),
): boolean {
  const age = profileAge(profile, now);
  if (age === null) return true;
  return age >= MINIMUM_AGE;
}

/** The single gate every conversational-AI entry point consults. */
export function canUseAiChat(
  profile: Pick<UserProfile, 'birthDate'> | null,
  now: Date = new Date(),
): boolean {
  if (AGE_ENFORCEMENT === 'soft') return true;
  return meetsMinimumAge(profile, now);
}

/** ISO date (yyyy-mm-dd) for a sensible default in the birthday picker. */
export function defaultBirthDate(now: Date = new Date()): Date {
  return new Date(now.getFullYear() - MINIMUM_AGE, now.getMonth(), now.getDate());
}
