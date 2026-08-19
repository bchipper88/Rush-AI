import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { initialStreak, StreakState, updateStreak } from '@/features/streak/streakUtils';

interface StreakStore {
  streak: StreakState;
  /** call on app open — safe to call repeatedly, only the first per day counts */
  recordVisit: (today: string) => StreakState;
  resetStreak: () => void;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      streak: initialStreak,
      recordVisit: (today) => {
        const next = updateStreak(get().streak, today);
        if (next !== get().streak) set({ streak: next });
        return next;
      },
      resetStreak: () => set({ streak: initialStreak }),
    }),
    {
      name: 'rushai-streak',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
