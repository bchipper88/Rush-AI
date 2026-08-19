import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected, onPress }: ChipProps) {
  const handlePress = () => {
    if (!onPress) return;
    Haptics.selectionAsync();
    onPress();
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <AppText
        variant="small"
        weight="semibold"
        color={selected ? colors.primaryDark : colors.ink}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
    backgroundColor: colors.blush,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: colors.primaryFaint,
    borderColor: colors.primary,
  },
  pressed: { transform: [{ scale: 0.96 }] },
});
