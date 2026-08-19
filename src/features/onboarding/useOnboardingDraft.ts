import { create } from 'zustand';

import type { Priority } from '@/types';

interface OnboardingDraft {
  name: string;
  schoolId: string | null;
  customSchoolName: string;
  customSchoolDomain: string;
  priorities: Priority[];
  rushYear: number;
  rushSeason: 'fall' | 'spring' | null;
  targetDate: string | null;
  gpa: string;
  activities: string;
  setName: (name: string) => void;
  setSchool: (
    schoolId: string | null,
    customSchoolName?: string,
    customSchoolDomain?: string,
  ) => void;
  togglePriority: (p: Priority) => void;
  setRushYear: (year: number) => void;
  setRushSeason: (season: 'fall' | 'spring') => void;
  setTargetDate: (date: string | null) => void;
  setAcademics: (gpa: string, activities: string) => void;
  resetDraft: () => void;
}

const defaultYear = new Date().getFullYear() + 1;

/** In-memory draft while the user moves through onboarding; committed to the
 *  persisted profile store only on the final step. */
export const useOnboardingDraft = create<OnboardingDraft>((set) => ({
  name: '',
  schoolId: null,
  customSchoolName: '',
  customSchoolDomain: '',
  priorities: [],
  rushYear: defaultYear,
  rushSeason: null,
  targetDate: null,
  gpa: '',
  activities: '',
  setName: (name) => set({ name }),
  setSchool: (schoolId, customSchoolName = '', customSchoolDomain = '') =>
    set({ schoolId, customSchoolName, customSchoolDomain }),
  togglePriority: (p) =>
    set((s) => ({
      priorities: s.priorities.includes(p)
        ? s.priorities.filter((x) => x !== p)
        : [...s.priorities, p],
    })),
  setRushYear: (rushYear) => set({ rushYear, targetDate: null }),
  setRushSeason: (rushSeason) => set({ rushSeason, targetDate: null }),
  setTargetDate: (targetDate) => set({ targetDate }),
  setAcademics: (gpa, activities) => set({ gpa, activities }),
  resetDraft: () =>
    set({
      name: '',
      schoolId: null,
      customSchoolName: '',
      customSchoolDomain: '',
      priorities: [],
      rushYear: defaultYear,
      rushSeason: null,
      targetDate: null,
      gpa: '',
      activities: '',
    }),
}));
