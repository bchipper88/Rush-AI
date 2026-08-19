import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';

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
  const handlePress = () => {
    if (isPrimary) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    }
    onPress();
  };
  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
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
