import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing } from '@/theme';

interface SkeletonCardProps {
  lines?: number;
}

/** Shimmering placeholder used while async content loads. */
export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View style={styles.card}>
      {Array.from({ length: lines }, (_, i) => (
        <Animated.View
          key={i}
          style={[styles.line, i === lines - 1 && styles.short, style]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl - 4,
    gap: spacing.sm,
  },
  line: {
    height: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.blush,
  },
  short: { width: '60%' },
});
