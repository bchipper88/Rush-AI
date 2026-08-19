export interface StreakState {
  current: number;
  longest: number;
  /** yyyy-mm-dd of the last day she showed up */
  lastActiveDay: string | null;
  /** the one forgiven miss per streak */
  graceUsed: boolean;
}

export const initialStreak: StreakState = {
  current: 0,
  longest: 0,
  lastActiveDay: null,
  graceUsed: false,
};

export function dayKey(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Whole days between two yyyy-mm-dd keys (b - a). */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const start = Date.UTC(ay, am - 1, ad);
  const end = Date.UTC(by, bm - 1, bd);
  return Math.round((end - start) / 86_400_000);
}

/**
 * Advance the streak for a visit on `today`.
 *
 * - same day → nothing changes (idempotent, so every app open is safe)
 * - next day → +1
 * - one missed day → forgiven once per streak ("streak freeze"), still +1
 * - anything longer, or a second miss → the streak restarts at 1
 */
export function updateStreak(state: StreakState, today: string): StreakState {
  if (state.lastActiveDay === today) return state;

  if (state.lastActiveDay === null) {
    return { current: 1, longest: Math.max(1, state.longest), lastActiveDay: today, graceUsed: false };
  }

  const gap = daysBetween(state.lastActiveDay, today);

  // A clock change or bad data should never inflate the streak.
  if (gap < 0) return state;

  let current: number;
  let graceUsed = state.graceUsed;

  if (gap === 1) {
    current = state.current + 1;
  } else if (gap === 2 && !state.graceUsed) {
    current = state.current + 1;
    graceUsed = true;
  } else {
    current = 1;
    graceUsed = false;
  }

  return {
    current,
    longest: Math.max(current, state.longest),
    lastActiveDay: today,
    graceUsed,
  };
}

/** Milestones worth celebrating with confetti. */
export function isStreakMilestone(days: number): boolean {
  return days === 3 || days === 7 || days === 14 || days === 30 || (days > 0 && days % 50 === 0);
}
