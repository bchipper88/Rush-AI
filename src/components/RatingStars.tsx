import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

interface RatingStarsProps {
  value: number; // 0-5
  onChange?: (value: number) => void;
  size?: number;
}

export function RatingStars({ value, onChange, size = 28 }: RatingStarsProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const star = (
          <AppText
            style={{ fontSize: size, lineHeight: size * 1.2 }}
            color={filled ? colors.primary : colors.faint}>
            {filled ? '★' : '☆'}
          </AppText>
        );
        if (!onChange) return <View key={n}>{star}</View>;
        return (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`${n} star${n === 1 ? '' : 's'}`}
            hitSlop={4}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(n === value ? 0 : n);
            }}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
});
