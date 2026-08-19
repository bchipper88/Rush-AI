import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { colors } from '@/theme';

interface ProgressRingProps {
  /** 0-1 */
  progress: number;
  size?: number;
  label?: string;
}

const REVEAL_MS = 1200;

/**
 * Dependency-free completion ring: two animated half-ring layers create a
 * sweep effect, with a count-up percentage in the center (Headspace-style
 * 1200ms ease-out reveal).
 */
export function ProgressRing({ progress, size = 120, label }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const ringWidth = Math.max(8, size * 0.09);
  const anim = useSharedValue(0);
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    anim.value = 0;
    anim.value = withTiming(1, { duration: REVEAL_MS, easing: Easing.out(Easing.cubic) });
    const start = Date.now();
    const target = Math.round(clamped * 100);
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / REVEAL_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPct(Math.round(target * eased));
      if (t >= 1) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [clamped, anim]);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.9 + anim.value * 0.1 }],
    opacity: anim.value,
  }));

  return (
    <Animated.View style={[styles.wrap, scaleStyle]}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: ringWidth,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* progress arc approximation: colored ring fades in proportionally */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              margin: -ringWidth,
              borderRadius: size / 2,
              borderWidth: ringWidth,
              borderColor: colors.primary,
              opacity: Math.max(0.15, clamped),
              transform: [{ rotate: '-90deg' }],
              // simulate partial sweep by clipping the ring for low progress
              borderTopColor: clamped > 0 ? colors.primary : colors.border,
              borderRightColor: clamped > 0.25 ? colors.primary : colors.border,
              borderBottomColor: clamped > 0.5 ? colors.primary : colors.border,
              borderLeftColor: clamped > 0.75 ? colors.primary : colors.border,
            },
          ]}
        />
        <AppText variant="title" color={colors.primaryDark}>
          {displayPct}%
        </AppText>
        {label ? (
          <AppText variant="caption" weight="semibold" color={colors.muted}>
            {label}
          </AppText>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
});
