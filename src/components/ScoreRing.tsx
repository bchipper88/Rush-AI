import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
}

const REVEAL_MS = 1200;

function scoreColor(score: number): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

/**
 * Score badge with a Headspace-style reveal: 1200ms ease-out scale/fade,
 * count-up number, success haptic for strong scores.
 */
export function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const color = scoreColor(clamped);
  const ringWidth = Math.max(6, size * 0.07);
  const anim = useSharedValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.value = withTiming(1, { duration: REVEAL_MS, easing: Easing.out(Easing.cubic) });
    const start = Date.now();
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / REVEAL_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(clamped * eased));
      if (t >= 1) {
        clearInterval(interval);
        if (clamped >= 75) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, 40);
    return () => clearInterval(interval);
  }, [clamped, anim]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + anim.value * 0.1 }],
    opacity: anim.value,
  }));

  return (
    <Animated.View
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
        style,
      ]}>
      <AppText variant="title" color={color}>
        {display}
      </AppText>
      <AppText variant="caption" weight="semibold" color={colors.muted}>
        / 100
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
