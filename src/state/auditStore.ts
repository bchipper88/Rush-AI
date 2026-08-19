import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { StoredAuditResult } from '@/features/audit/auditClient';

interface AuditState {
  history: StoredAuditResult[];
  addResult: (result: StoredAuditResult) => void;
  clearHistory: () => void;
}

const MAX_HISTORY = 20;

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      history: [],
      addResult: (result) =>
        set((s) => ({ history: [result, ...s.history].slice(0, MAX_HISTORY) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'rushai-audits',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
