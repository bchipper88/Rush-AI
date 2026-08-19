import { getSchoolById } from '@/content/schools';
import type { UserProfile } from '@/types';

import { buildChecklist, resolveRushAnchor, resolveSchool } from './buildChecklist';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    name: 'Emma',
    schoolId: 'alabama',
    priorities: ['sisterhood'],
    rushYear: 2027,
    onboardingComplete: true,
    createdAt: '2026-08-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildChecklist', () => {
  it('includes rec-letter items and an August anchor for Alabama', () => {
    const profile = makeProfile({ schoolId: 'alabama' });
    const items = buildChecklist(profile, getSchoolById('alabama'));

    const recItems = items.filter((i) => i.phase === 'recs');
    expect(recItems.length).toBeGreaterThan(0);

    const packRushBag = items.find((i) => i.id === 'pack-rush-bag');
    expect(packRushBag?.dueLabel).toBe('By August 2027');
    expect(packRushBag?.dueDate).toBe('2027-08-01');
  });

  it('drops rec items and anchors to January for Cornell (deferred, no recs)', () => {
    const profile = makeProfile({ schoolId: 'cornell' });
    const items = buildChecklist(profile, getSchoolById('cornell'));

    expect(items.some((i) => i.phase === 'recs')).toBe(false);

    const packRushBag = items.find((i) => i.id === 'pack-rush-bag');
    expect(packRushBag?.dueLabel).toBe('By January 2027');
  });

  it('computes due dates across the year boundary for deferred rush', () => {
    const profile = makeProfile({ schoolId: 'cornell', rushYear: 2027 });
    const items = buildChecklist(profile, getSchoolById('cornell'));

    // social résumé is 4 months before a January rush → September of prior year
    const resume = items.find((i) => i.id === 'social-resume');
    expect(resume?.dueDate).toBe('2026-09-01');
    expect(resume?.dueLabel).toBe('By September 2026');
  });

  it('includes the budget item only for cost tier 3 schools', () => {
    const alabama = buildChecklist(makeProfile({ schoolId: 'alabama' }));
    const ucla = buildChecklist(makeProfile({ schoolId: 'ucla' }));

    expect(alabama.some((i) => i.id === 'budget-worksheet')).toBe(true);
    expect(ucla.some((i) => i.id === 'budget-worksheet')).toBe(false);
  });

  it('includes the GPA study-plan item only when academics is a priority', () => {
    const withAcademics = buildChecklist(makeProfile({ priorities: ['academics'] }));
    const without = buildChecklist(makeProfile({ priorities: ['social'] }));

    expect(withAcademics.some((i) => i.id === 'gpa-study-plan')).toBe(true);
    expect(without.some((i) => i.id === 'gpa-study-plan')).toBe(false);
  });

  it('falls back to the default school for custom/unknown schools', () => {
    const profile = makeProfile({ schoolId: 'custom', customSchoolName: 'Tiny College' });
    const school = resolveSchool(profile);

    expect(school.id).toBe('custom');
    const items = buildChecklist(profile, school);
    // default school: fall rush + recs recommended → rec items included
    expect(items.some((i) => i.phase === 'recs')).toBe(true);
    expect(items.find((i) => i.id === 'pack-rush-bag')?.dueLabel).toBe('By August 2027');
  });

  it('lets a season override move an SMU (spring) plan to fall', () => {
    const profile = makeProfile({ schoolId: 'smu', rushSeason: 'fall' });
    const items = buildChecklist(profile, getSchoolById('smu'));
    expect(items.find((i) => i.id === 'pack-rush-bag')?.dueLabel).toBe('By August 2027');
    // SMU still requires recs regardless of season
    expect(items.some((i) => i.phase === 'recs')).toBe(true);
  });

  it('anchors everything to an exact target date when set', () => {
    const profile = makeProfile({ schoolId: 'alabama', targetDate: '2027-08-07' });
    const school = getSchoolById('alabama')!;
    expect(resolveRushAnchor(profile, school).getDate()).toBe(7);
    const items = buildChecklist(profile, school);
    expect(items.find((i) => i.id === 'audit-instagram')?.dueLabel).toBe('By June 2027');
  });

  it('keeps the school usual month when the chosen season matches it', () => {
    // UCLA rushes in September; choosing "fall" should keep September, not force August
    const profile = makeProfile({ schoolId: 'ucla', rushSeason: 'fall' });
    expect(resolveRushAnchor(profile, getSchoolById('ucla')!).getMonth()).toBe(8);
  });

  it('uses the school registration offset for the registration item', () => {
    const lsu = buildChecklist(makeProfile({ schoolId: 'lsu' }));
    // LSU: rushMonth 8, registrationOpensMonthsBefore 4 → April
    expect(lsu.find((i) => i.id === 'register-panhellenic')?.dueLabel).toBe('By April 2027');
  });

  it('is sorted by due date', () => {
    const items = buildChecklist(makeProfile());
    const dates = items.map((i) => i.dueDate);
    expect([...dates].sort()).toEqual(dates);
  });
});
