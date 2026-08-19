import type { GeneratedChecklistItem } from '@/types';

import { buildDailyFocus, hashDay } from './dailyFocus';

function item(id: string): GeneratedChecklistItem {
  return {
    id,
    title: id,
    detail: 'detail',
    phase: 'register',
    monthsBeforeRush: 1,
    dueDate: '2027-08-01',
    dueLabel: 'By August 2027',
  };
}

const items = [item('a'), item('b'), item('c'), item('d')];

describe('hashDay', () => {
  it('is stable for the same input and varies by day', () => {
    expect(hashDay('2026-08-19')).toBe(hashDay('2026-08-19'));
    expect(hashDay('2026-08-19')).not.toBe(hashDay('2026-08-20'));
  });

  it('varies by salt so two users get different cards', () => {
    expect(hashDay('2026-08-19', 'emma')).not.toBe(hashDay('2026-08-19', 'sadie'));
  });
});

describe('buildDailyFocus', () => {
  it('is deterministic within a day', () => {
    const a = buildDailyFocus(items, {}, '2026-08-19', 'emma');
    const b = buildDailyFocus(items, {}, '2026-08-19', 'emma');
    expect(a).toEqual(b);
  });

  it('only ever surfaces an undone task', () => {
    const focus = buildDailyFocus(items, { a: true, b: true, c: true }, '2026-08-19');
    expect(focus.task?.id).toBe('d');
  });

  it('returns no task when everything is done', () => {
    const done = Object.fromEntries(items.map((i) => [i.id, true]));
    expect(buildDailyFocus(items, done, '2026-08-19').task).toBeNull();
  });

  it('rotates the task across days', () => {
    const picks = new Set(
      ['2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'].map(
        (d) => buildDailyFocus(items, {}, d).task?.id,
      ),
    );
    expect(picks.size).toBeGreaterThan(1);
  });

  it('always supplies a tip drawn from the article library', () => {
    const focus = buildDailyFocus(items, {}, '2026-08-19');
    expect(focus.tip.text.length).toBeGreaterThan(0);
    expect(focus.tip.slug.length).toBeGreaterThan(0);
    expect(focus.greeting.length).toBeGreaterThan(0);
  });

  it('handles an empty checklist', () => {
    const focus = buildDailyFocus([], {}, '2026-08-19');
    expect(focus.task).toBeNull();
    expect(focus.tip.text.length).toBeGreaterThan(0);
  });
});
