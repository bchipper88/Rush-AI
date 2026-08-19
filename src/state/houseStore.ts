import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  emptyRoundLog,
  HouseStatus,
  RoundLog,
  RushRound,
  TrackedHouse,
} from '@/features/houses/houseUtils';

interface HouseState {
  houses: TrackedHouse[];
  /** her own MRABA order, set on the ranking screen */
  prefOrder: string[];
  addHouse: (house: TrackedHouse) => void;
  removeHouse: (id: string) => void;
  setStatus: (id: string, status: HouseStatus) => void;
  updateRound: (id: string, round: RushRound, patch: Partial<RoundLog>) => void;
  setPrefOrder: (ids: string[]) => void;
  clearHouses: () => void;
}

export const useHouseStore = create<HouseState>()(
  persist(
    (set) => ({
      houses: [],
      prefOrder: [],
      addHouse: (house) =>
        set((s) =>
          s.houses.some((h) => h.id === house.id)
            ? s
            : { houses: [...s.houses, house] },
        ),
      removeHouse: (id) =>
        set((s) => ({
          houses: s.houses.filter((h) => h.id !== id),
          prefOrder: s.prefOrder.filter((x) => x !== id),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          houses: s.houses.map((h) => (h.id === id ? { ...h, status } : h)),
        })),
      updateRound: (id, round, patch) =>
        set((s) => ({
          houses: s.houses.map((h) =>
            h.id === id
              ? {
                  ...h,
                  rounds: {
                    ...h.rounds,
                    [round]: { ...(h.rounds[round] ?? emptyRoundLog()), ...patch },
                  },
                }
              : h,
          ),
        })),
      setPrefOrder: (prefOrder) => set({ prefOrder }),
      clearHouses: () => set({ houses: [], prefOrder: [] }),
    }),
    {
      name: 'rushai-houses',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
