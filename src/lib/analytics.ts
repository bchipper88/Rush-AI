import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AnalyticsEvent } from '../../shared/events';
import { makeId } from '@/lib/id';

const QUEUE_CAP = 200;
const BATCH_SIZE = 50;

interface AnalyticsState {
  installId: string;
  /** user-controllable consent toggle (Profile → Data & privacy) */
  enabled: boolean;
  queue: AnalyticsEvent[];
  setEnabled: (enabled: boolean) => void;
  enqueue: (event: AnalyticsEvent) => void;
  dequeue: (count: number) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      installId: makeId('install'),
      enabled: true,
      queue: [],
      setEnabled: (enabled) => set({ enabled }),
      enqueue: (event) =>
        set((s) => ({ queue: [...s.queue, event].slice(-QUEUE_CAP) })),
      dequeue: (count) => set((s) => ({ queue: s.queue.slice(count) })),
    }),
    {
      name: 'rushai-analytics',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

function getApiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/$/, '');
}

let flushing = false;

/** Push queued events to the server; silent no-op offline or in demo mode. */
export async function flushEvents(): Promise<void> {
  const base = getApiBaseUrl();
  const { queue, enabled, dequeue } = useAnalyticsStore.getState();
  if (!base || !enabled || queue.length === 0 || flushing) return;
  flushing = true;
  try {
    const batch = queue.slice(0, BATCH_SIZE);
    const res = await fetch(`${base}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
    });
    if (res.ok) {
      dequeue(batch.length);
    }
  } catch {
    // keep queued; retried on next track() call
  } finally {
    flushing = false;
  }
}

/**
 * Record an anonymous product event (no names, no photos, no message text).
 * Queued locally, shipped in batches when a server is configured and the
 * user hasn't opted out.
 */
export function track(
  name: string,
  props?: AnalyticsEvent['props'],
): void {
  const { installId, enabled, enqueue } = useAnalyticsStore.getState();
  if (!enabled) return;
  enqueue({
    installId,
    name,
    ts: new Date().toISOString(),
    props,
  });
  flushEvents();
}
