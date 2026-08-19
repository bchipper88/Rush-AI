/**
 * Product policy switches.
 *
 * AGE_ENFORCEMENT decides what happens when a user is under MINIMUM_AGE:
 *   'soft' — record her age, show an age-appropriate notice, block nothing.
 *   'hard' — block AI chat + practice mode (the conversational surfaces) and
 *            show a warm "come back at 18" screen instead.
 *
 * Flip the constant below to change the policy app-wide; every gate reads
 * `canUseAiChat()` / `meetsMinimumAge()` from src/features/onboarding/age.ts.
 */
export const MINIMUM_AGE = 18;

export const AGE_ENFORCEMENT: 'soft' | 'hard' = 'soft';
