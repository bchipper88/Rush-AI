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
  const anchor = rushAnchorDate(profile.rushYear, school.rushMonth);

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
