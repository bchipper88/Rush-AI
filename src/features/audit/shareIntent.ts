import Constants, { ExecutionEnvironment } from 'expo-constants';
import { create } from 'zustand';

export interface SharedFile {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

interface PendingShare {
  files: SharedFile[];
  text?: string;
}

interface ShareState {
  pending: PendingShare | null;
  setPending: (share: PendingShare) => void;
  consumePending: () => PendingShare | null;
}

/** In-memory hand-off from the OS share sheet to the audit screen. */
export const useShareStore = create<ShareState>((set, get) => ({
  pending: null,
  setPending: (pending) => set({ pending }),
  consumePending: () => {
    const current = get().pending;
    set({ pending: null });
    return current;
  },
}));

interface ShareIntentHook {
  hasShareIntent: boolean;
  shareIntent: {
    files?: { path: string; mimeType?: string; width?: number; height?: number }[] | null;
    text?: string | null;
    webUrl?: string | null;
  };
  resetShareIntent: () => void;
}

const noopHook = (): ShareIntentHook => ({
  hasShareIntent: false,
  shareIntent: {},
  resetShareIntent: () => {},
});

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * Expo Go has no share-extension native module, so resolve the real hook only
 * in dev/production builds. Resolved once at module scope, so hook rules hold.
 */
let resolvedHook: () => ShareIntentHook = noopHook;
if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    resolvedHook = require('expo-share-intent').useShareIntent;
  } catch {
    resolvedHook = noopHook;
  }
}

export const useShareIntentSafe = resolvedHook;

export function normalizeSharedUri(path: string): string {
  return path.startsWith('file://') || path.startsWith('content://')
    ? path
    : `file://${path}`;
}
