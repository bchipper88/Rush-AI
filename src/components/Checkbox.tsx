import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii } from '@/theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      hitSlop={10}>
      <View style={[styles.box, checked && styles.checked]}>
        {checked ? (
          <AppText variant="small" weight="bold" color={colors.white}>
            ✓
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 26,
    height: 26,
    borderRadius: radii.sm,
    borderWidth: 2,
    borderColor: colors.primarySoft,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
