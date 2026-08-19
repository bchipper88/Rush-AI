import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
}

function scoreColor(score: number): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

/**
 * Dependency-free "ring": a circular track with a colored border whose
 * opacity communicates progress, plus the numeric score. Keeps us free of
 * SVG libraries while still reading clearly as a score badge.
 */
export function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const color = scoreColor(clamped);
  const ringWidth = Math.max(6, size * 0.07);
  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor: color,
          backgroundColor: colors.white,
        },
      ]}>
      <AppText variant="title" color={color}>
        {clamped}
      </AppText>
      <AppText variant="caption" weight="semibold" color={colors.muted}>
        / 100
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
