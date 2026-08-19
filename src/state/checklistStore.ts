import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ChecklistState {
  /** done-state keyed by checklist template id — survives profile edits */
  done: Record<string, boolean>;
  toggle: (templateId: string) => void;
  resetChecklist: () => void;
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      done: {},
      toggle: (templateId) =>
        set((s) => ({ done: { ...s.done, [templateId]: !s.done[templateId] } })),
      resetChecklist: () => set({ done: {} }),
    }),
    {
      name: 'rushai-checklist',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
