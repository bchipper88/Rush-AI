import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme';
import type { AuditVerdict } from '../../shared/audit';

type Verdict = AuditVerdict['verdict'];

export const verdictMeta: Record<Verdict, { label: string; color: string; emoji: string }> = {
  keep: { label: 'Keep', color: colors.verdictKeep, emoji: '💖' },
  edit: { label: 'Edit', color: colors.verdictEdit, emoji: '✂️' },
  archive: { label: 'Archive', color: colors.verdictArchive, emoji: '📦' },
  delete: { label: 'Delete', color: colors.verdictDelete, emoji: '🗑️' },
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const meta = verdictMeta[verdict];
  return (
    <View style={[styles.badge, { backgroundColor: meta.color }]}>
      <AppText variant="caption" weight="bold" color={colors.white}>
        {meta.emoji} {meta.label.toUpperCase()}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    alignSelf: 'flex-start',
  },
});
