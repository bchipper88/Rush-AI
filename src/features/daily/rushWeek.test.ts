import { currentRushDay, isRushWeek, roundLabel, rushWeekPlan } from './rushWeek';

describe('isRushWeek', () => {
  it('covers the week before and after the anchor', () => {
    expect(isRushWeek(7)).toBe(true);
    expect(isRushWeek(0)).toBe(true);
    expect(isRushWeek(-7)).toBe(true);
  });

  it('is false outside that window', () => {
    expect(isRushWeek(8)).toBe(false);
    expect(isRushWeek(-8)).toBe(false);
    expect(isRushWeek(120)).toBe(false);
  });
});

describe('currentRushDay', () => {
  it('maps the anchor day to Open House', () => {
    expect(currentRushDay(0)?.round).toBe('open_house');
  });

  it('walks through the week as the countdown goes negative', () => {
    expect(currentRushDay(-1)?.round).toBe('philanthropy');
    expect(currentRushDay(-2)?.round).toBe('sisterhood');
    expect(currentRushDay(-3)?.round).toBe('preference');
    expect(currentRushDay(-4)?.round).toBe('bid_day');
  });

  it('returns null before the week starts and after Bid Day', () => {
    expect(currentRushDay(3)).toBeNull();
    expect(currentRushDay(-9)).toBeNull();
  });
});

describe('rushWeekPlan', () => {
  it('has an entry per round plus Bid Day, in order', () => {
    expect(rushWeekPlan).toHaveLength(5);
    expect(rushWeekPlan.map((d) => d.offset)).toEqual([0, 1, 2, 3, 4]);
    expect(rushWeekPlan[4].round).toBe('bid_day');
  });

  it('gives every day something to wear, bring, and remember', () => {
    for (const day of rushWeekPlan) {
      expect(day.wear.length).toBeGreaterThan(0);
      expect(day.bring.length).toBeGreaterThan(0);
      expect(day.reminder.length).toBeGreaterThan(0);
      expect(roundLabel(day.round).length).toBeGreaterThan(0);
    }
  });
});
