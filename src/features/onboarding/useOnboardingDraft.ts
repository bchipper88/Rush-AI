import { create } from 'zustand';

import type { Priority } from '@/types';

interface OnboardingDraft {
  name: string;
  schoolId: string | null;
  customSchoolName: string;
  priorities: Priority[];
  rushYear: number;
  gpa: string;
  activities: string;
  setName: (name: string) => void;
  setSchool: (schoolId: string | null, customSchoolName?: string) => void;
  togglePriority: (p: Priority) => void;
  setRushYear: (year: number) => void;
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
  priorities: [],
  rushYear: defaultYear,
  gpa: '',
  activities: '',
  setName: (name) => set({ name }),
  setSchool: (schoolId, customSchoolName = '') => set({ schoolId, customSchoolName }),
  togglePriority: (p) =>
    set((s) => ({
      priorities: s.priorities.includes(p)
        ? s.priorities.filter((x) => x !== p)
        : [...s.priorities, p],
    })),
  setRushYear: (rushYear) => set({ rushYear }),
  setAcademics: (gpa, activities) => set({ gpa, activities }),
  resetDraft: () =>
    set({
      name: '',
      schoolId: null,
      customSchoolName: '',
      priorities: [],
      rushYear: defaultYear,
      gpa: '',
      activities: '',
    }),
}));
