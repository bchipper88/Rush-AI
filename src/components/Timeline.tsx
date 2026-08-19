import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme';

export interface TimelineItem {
  key: string;
  title: string;
  subtitle?: string;
  state: 'done' | 'current' | 'upcoming';
  right?: ReactNode;
}

/** Vertical progress rail — used for rush rounds and the week-of agenda. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <View>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        const dotColor =
          item.state === 'done'
            ? colors.success
            : item.state === 'current'
              ? colors.primary
              : colors.border;
        return (
          <View key={item.key} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: dotColor },
                  item.state === 'current' && styles.currentDot,
                ]}
              />
              {!last ? <View style={styles.line} /> : null}
            </View>
            <View style={styles.body}>
              <View style={styles.header}>
                <AppText
                  weight={item.state === 'current' ? 'bold' : 'semibold'}
                  color={item.state === 'upcoming' ? colors.muted : colors.ink}
                  style={styles.title}>
                  {item.title}
                </AppText>
                {item.right}
              </View>
              {item.subtitle ? (
                <AppText variant="small" color={colors.muted}>
                  {item.subtitle}
                </AppText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: 20 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radii.pill,
    marginTop: 4,
  },
  currentDot: {
    width: 16,
    height: 16,
    borderWidth: 3,
    borderColor: colors.primaryFaint,
  },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 },
  body: { flex: 1, paddingBottom: spacing.lg, gap: 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { flex: 1 },
});
