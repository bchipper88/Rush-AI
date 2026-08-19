import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { daysUntil } from '@/lib/dates';

/**
 * Local (scheduled) notifications only — those still work in Expo Go.
 * Remote push would require a dev build, so we deliberately don't use it.
 * Everything is behind a lazy require + try/catch so a missing native module
 * can never crash the app.
 */
interface NotificationsModule {
  getPermissionsAsync: () => Promise<{ status: string }>;
  requestPermissionsAsync: () => Promise<{ status: string }>;
  cancelAllScheduledNotificationsAsync: () => Promise<void>;
  scheduleNotificationAsync: (input: unknown) => Promise<string>;
  setNotificationHandler: (handler: unknown) => void;
  AndroidNotificationPriority?: unknown;
  SchedulableTriggerInputTypes?: Record<string, string>;
}

let cached: NotificationsModule | null | undefined;

function getModule(): NotificationsModule | null {
  if (cached !== undefined) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-notifications') as NotificationsModule;
    cached.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  } catch {
    cached = null;
  }
  return cached;
}

export interface NotificationPrefs {
  enabled: boolean;
  /** local hour (0-23) for the daily nudge */
  hour: number;
}

interface NotificationState extends NotificationPrefs {
  setEnabled: (enabled: boolean) => void;
  setHour: (hour: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      enabled: false,
      hour: 9,
      setEnabled: (enabled) => set({ enabled }),
      setHour: (hour) => set({ hour }),
    }),
    {
      name: 'rushai-notifications',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export async function requestNotificationPermission(): Promise<boolean> {
  const mod = getModule();
  if (!mod) return false;
  try {
    const current = await mod.getPermissionsAsync();
    if (current.status === 'granted') return true;
    const asked = await mod.requestPermissionsAsync();
    return asked.status === 'granted';
  } catch {
    return false;
  }
}

interface ScheduleInput {
  dailyHour: number;
  rushAnchor: Date;
  nextTaskTitle?: string;
}

/**
 * Rebuild the whole schedule: a daily nudge plus countdown milestones.
 * Cancels first so repeated calls stay idempotent.
 */
export async function rescheduleAll(input: ScheduleInput): Promise<number> {
  const mod = getModule();
  if (!mod) return 0;

  try {
    await mod.cancelAllScheduledNotificationsAsync();
    const daily = mod.SchedulableTriggerInputTypes?.DAILY ?? 'daily';
    const timeInterval = mod.SchedulableTriggerInputTypes?.TIME_INTERVAL ?? 'timeInterval';
    let scheduled = 0;

    await mod.scheduleNotificationAsync({
      content: {
        title: 'Rush AI 🎀',
        body: input.nextTaskTitle
          ? `Today's focus: ${input.nextTaskTitle}`
          : 'Two minutes on your rush plan today?',
      },
      trigger: { type: daily, hour: input.dailyHour, minute: 0 },
    });
    scheduled += 1;

    const milestones = [30, 7, 1];
    for (const days of milestones) {
      const secondsUntil = (daysUntil(input.rushAnchor) - days) * 86_400;
      if (secondsUntil <= 60) continue;
      await mod.scheduleNotificationAsync({
        content: {
          title: days === 1 ? 'Rush is tomorrow! 🎉' : `${days} days until rush`,
          body:
            days === 1
              ? 'Lay out your outfit, charge your phone, and get some sleep. You are ready.'
              : days === 7
                ? 'One week out — time to pack your rush bag and practice your intro.'
                : 'One month out. Check your plan for anything due soon.',
        },
        trigger: { type: timeInterval, seconds: Math.round(secondsUntil), repeats: false },
      });
      scheduled += 1;
    }
    return scheduled;
  } catch {
    return 0;
  }
}

export async function cancelAll(): Promise<void> {
  const mod = getModule();
  if (!mod) return;
  try {
    await mod.cancelAllScheduledNotificationsAsync();
  } catch {
    // best effort
  }
}

export function notificationsAvailable(): boolean {
  return getModule() !== null;
}
