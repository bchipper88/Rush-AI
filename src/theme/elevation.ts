import type { ViewStyle } from 'react-native';

import { colors } from './colors';

/**
 * Shared shadow presets. `glow` is the brand-tinted card shadow (Flo-style):
 * pink at low opacity with a wide blur, which reads as soft depth rather than
 * a gray drop shadow.
 */
export const elevation: Record<'sm' | 'md' | 'lg' | 'glow', ViewStyle> = {
  sm: {
    shadowColor: colors.ink,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  md: {
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
};
