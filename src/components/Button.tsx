import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const LEDGE = 4;

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const textColor = isPrimary ? colors.white : colors.primaryDark;
  const pressY = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressY.value }],
  }));

  const handlePress = () => {
    if (isPrimary) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
    onPress();
  };

  if (isPrimary) {
    // Duolingo-style 3D slab: dark ledge below, face presses down onto it
    return (
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        disabled={disabled || loading}
        onPressIn={() => {
          // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are mutated by design
          pressY.value = withTiming(LEDGE, { duration: 80, easing: Easing.linear });
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability -- Reanimated shared values are mutated by design
          pressY.value = withSpring(0, { damping: 14, stiffness: 200 });
        }}
        style={[styles.slabWrap, (disabled || loading) && styles.disabled, style]}>
        <View style={styles.ledge} />
        <Animated.View style={[styles.base, styles.primary, faceStyle]}>
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <AppText variant="subheading" weight="semibold" color={textColor}>
              {label}
            </AppText>
          )}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText variant="subheading" weight="semibold" color={textColor}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slabWrap: { position: 'relative', paddingBottom: LEDGE },
  ledge: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: LEDGE,
    bottom: 0,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryDark,
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.blush,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
});
