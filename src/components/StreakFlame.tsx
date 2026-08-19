import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

interface StreakFlameProps {
  days: number;
  size?: number;
}

/** Pulsing streak flame (Duolingo pattern: 1.0 → 1.05 over 2s, looping). */
export function StreakFlame({ days, size = 22 }: StreakFlameProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (days <= 0) return;
    pulse.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse, days]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={styles.row}>
      <Animated.View style={style}>
        <AppText style={{ fontSize: size, lineHeight: size * 1.2 }}>
          {days > 0 ? '🔥' : '🕯️'}
        </AppText>
      </Animated.View>
      <AppText variant="subheading" weight="bold" color={days > 0 ? colors.warning : colors.faint}>
        {days}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
