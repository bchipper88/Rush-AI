import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme';

export interface Segment<T extends string> {
  key: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (key: T) => void;
  scrollable?: boolean;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  scrollable,
}: SegmentedControlProps<T>) {
  const items = segments.map((seg) => {
    const active = seg.key === value;
    return (
      <Pressable
        key={seg.key}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        onPress={() => {
          Haptics.selectionAsync();
          onChange(seg.key);
        }}
        style={[styles.segment, active && styles.active]}>
        <AppText
          variant="small"
          weight="semibold"
          color={active ? colors.white : colors.muted}>
          {seg.label}
        </AppText>
      </Pressable>
    );
  });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.track}>
        {items}
      </ScrollView>
    );
  }
  return <ScrollView horizontal={false} contentContainerStyle={styles.track}>{items}</ScrollView>;
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.blush,
    borderRadius: radii.pill,
    padding: spacing.xs,
  },
  segment: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  active: { backgroundColor: colors.primary },
});
