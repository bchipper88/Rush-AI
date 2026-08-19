import { checklistTemplates } from '@/content/checklistTemplates';
import { defaultSchool, getSchoolById } from '@/content/schools';
import { formatMonthYear, monthsBefore, rushAnchorDate, toISODate } from '@/lib/dates';
import type {
  ChecklistTemplateItem,
  GeneratedChecklistItem,
  School,
  UserProfile,
} from '@/types';

import { phaseOrder } from './phases';

export function resolveSchool(profile: Pick<UserProfile, 'schoolId'>): School {
  return getSchoolById(profile.schoolId) ?? defaultSchool;
}

export type RushSeason = 'fall' | 'spring';

export function schoolSeason(school: School): RushSeason {
  return school.style === 'deferred_spring' ? 'spring' : 'fall';
}

/**
 * The date recruitment is anchored to, in priority order:
 * 1. the user's exact target date, 2. her chosen season (school's usual
 * month when they agree, else Aug/Jan), 3. the school's usual schedule.
 */
export function resolveRushAnchor(
  profile: Pick<UserProfile, 'rushYear' | 'rushSeason' | 'targetDate'>,
  school: School,
): Date {
  if (profile.targetDate) {
    const [y, m, d] = profile.targetDate.split('-').map(Number);
    return new Date(y, m - 1, d || 1);
  }
  const usual = schoolSeason(school);
  const season = profile.rushSeason ?? usual;
  const month = season === usual ? school.rushMonth : season === 'fall' ? 8 : 1;
  return rushAnchorDate(profile.rushYear, month);
}

function matches(item: ChecklistTemplateItem, profile: UserProfile, school: School): boolean {
  const cond = item.appliesIf;
  if (!cond) return true;
  if (cond.recs && !cond.recs.includes(school.recs)) return false;
  if (cond.style && !cond.style.includes(school.style)) return false;
  if (cond.minCostTier && school.costTier < cond.minCostTier) return false;
  if (cond.priorities && !cond.priorities.some((p) => profile.priorities.includes(p))) {
    return false;
  }
  return true;
}

/**
 * Pure personalization engine: onboarding profile + school metadata →
 * dated, ordered checklist. Deterministic so regenerating after a profile
 * edit is safe; done-state lives separately, keyed by template id.
 */
export function buildChecklist(
  profile: UserProfile,
  school: School = resolveSchool(profile),
): GeneratedChecklistItem[] {
  const anchor = resolveRushAnchor(profile, school);

  return checklistTemplates
    .filter((item) => matches(item, profile, school))
    .map((item) => {
      const months =
        item.id === 'register-panhellenic'
          ? school.registrationOpensMonthsBefore
          : item.monthsBeforeRush;
      const due = monthsBefore(anchor, months);
      return {
        ...item,
        dueDate: toISODate(due),
        dueLabel: `By ${formatMonthYear(due)}`,
      };
    })
    .sort((a, b) => {
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      return phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase);
    });
}
