import { StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, elevation, radii, spacing } from '@/theme';

interface StatTileProps {
  value: string | number;
  label: string;
  emoji?: string;
  tone?: 'default' | 'primary' | 'success';
  style?: ViewStyle;
}

/** Compact KPI tile for dashboards (streak, houses left, tasks done). */
export function StatTile({ value, label, emoji, tone = 'default', style }: StatTileProps) {
  const valueColor =
    tone === 'primary' ? colors.primary : tone === 'success' ? colors.success : colors.ink;
  return (
    <View style={[styles.tile, style]}>
      {emoji ? <AppText style={styles.emoji}>{emoji}</AppText> : null}
      <AppText variant="heading" color={valueColor}>
        {value}
      </AppText>
      <AppText variant="caption" weight="semibold" color={colors.muted}>
        {label.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: 2,
    ...elevation.sm,
  },
  emoji: { fontSize: 20, lineHeight: 24 },
});
