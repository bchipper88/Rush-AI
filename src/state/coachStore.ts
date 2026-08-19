import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ChatBubble {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** follow-up chips attached to an assistant reply */
  suggestions?: string[];
  source?: 'claude' | 'mock';
}

interface CoachState {
  messages: ChatBubble[];
  addMessage: (bubble: ChatBubble) => void;
  clearChat: () => void;
}

const MAX_MESSAGES = 60;

export const useCoachStore = create<CoachState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (bubble) =>
        set((s) => ({ messages: [...s.messages, bubble].slice(-MAX_MESSAGES) })),
      clearChat: () => set({ messages: [] }),
    }),
    {
      name: 'rushai-coach-chat',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
