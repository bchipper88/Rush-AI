import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { UserProfile } from '@/types';

interface ProfileState {
  profile: UserProfile | null;
  hasHydrated: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  resetProfile: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      hasHydrated: false,
      setProfile: (profile) => set({ profile }),
      updateProfile: (patch) =>
        set((s) => (s.profile ? { profile: { ...s.profile, ...patch } } : s)),
      resetProfile: () => set({ profile: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'rushai-profile',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ profile: s.profile }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
