import {
  dayKey,
  daysBetween,
  initialStreak,
  isStreakMilestone,
  StreakState,
  updateStreak,
} from './streakUtils';

describe('dayKey / daysBetween', () => {
  it('formats a local day key', () => {
    expect(dayKey(new Date(2026, 7, 9))).toBe('2026-08-09');
  });

  it('counts days across month and year boundaries', () => {
    expect(daysBetween('2026-08-19', '2026-08-20')).toBe(1);
    expect(daysBetween('2026-08-31', '2026-09-01')).toBe(1);
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetween('2026-08-19', '2026-08-19')).toBe(0);
  });
});

describe('updateStreak', () => {
  it('starts a streak on the first visit', () => {
    const s = updateStreak(initialStreak, '2026-08-19');
    expect(s.current).toBe(1);
    expect(s.longest).toBe(1);
    expect(s.lastActiveDay).toBe('2026-08-19');
  });

  it('is idempotent within the same day', () => {
    const first = updateStreak(initialStreak, '2026-08-19');
    const second = updateStreak(first, '2026-08-19');
    expect(second).toBe(first);
  });

  it('increments on consecutive days', () => {
    let s = updateStreak(initialStreak, '2026-08-19');
    s = updateStreak(s, '2026-08-20');
    s = updateStreak(s, '2026-08-21');
    expect(s.current).toBe(3);
    expect(s.longest).toBe(3);
  });

  it('forgives exactly one missed day per streak', () => {
    let s: StreakState = { current: 5, longest: 5, lastActiveDay: '2026-08-19', graceUsed: false };
    s = updateStreak(s, '2026-08-21'); // missed the 20th
    expect(s.current).toBe(6);
    expect(s.graceUsed).toBe(true);

    // a second miss in the same streak resets it
    s = updateStreak(s, '2026-08-23');
    expect(s.current).toBe(1);
    expect(s.graceUsed).toBe(false);
  });

  it('resets after a long gap but keeps the record', () => {
    const s = updateStreak(
      { current: 9, longest: 9, lastActiveDay: '2026-08-01', graceUsed: false },
      '2026-08-19',
    );
    expect(s.current).toBe(1);
    expect(s.longest).toBe(9);
  });

  it('grace resets once a fresh consecutive streak is running', () => {
    let s: StreakState = { current: 2, longest: 2, lastActiveDay: '2026-08-19', graceUsed: false };
    s = updateStreak(s, '2026-08-21'); // uses grace
    expect(s.graceUsed).toBe(true);
    s = updateStreak(s, '2026-08-24'); // misses two → reset, grace freed
    expect(s.current).toBe(1);
    expect(s.graceUsed).toBe(false);
  });

  it('ignores a backwards clock', () => {
    const s: StreakState = { current: 4, longest: 4, lastActiveDay: '2026-08-19', graceUsed: false };
    expect(updateStreak(s, '2026-08-17')).toBe(s);
  });
});

describe('isStreakMilestone', () => {
  it('celebrates the meaningful numbers only', () => {
    expect(isStreakMilestone(3)).toBe(true);
    expect(isStreakMilestone(7)).toBe(true);
    expect(isStreakMilestone(30)).toBe(true);
    expect(isStreakMilestone(50)).toBe(true);
    expect(isStreakMilestone(4)).toBe(false);
    expect(isStreakMilestone(0)).toBe(false);
  });
});
