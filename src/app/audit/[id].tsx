import { router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ScoreRing } from '@/components/ScoreRing';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { VerdictBadge } from '@/components/VerdictBadge';
import { useAuditStore } from '@/state/auditStore';
import { colors, radii, spacing } from '@/theme';
import type { RiskFlag } from '../../../shared/audit';

const flagLabels: Record<RiskFlag, string> = {
  alcohol_party: 'party context',
  revealing: 'outfit check',
  controversial: 'controversial',
  profanity: 'language',
  five_bs: "five b's topic",
  negative_tone: 'negative tone',
  messy_grid: 'grid cohesion',
  low_quality: 'photo quality',
  none: '',
};

export default function AuditResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const audit = useAuditStore((s) => s.history.find((a) => a.id === id));

  if (!audit) {
    return (
      <Screen safeTop>
        <EmptyState
          emoji="🕵️‍♀️"
          title="Audit not found"
          message="This result may have been cleared. Run a fresh audit from the Audit tab."
        />
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen safeTop>
      <Button
        label="← Back"
        variant="ghost"
        onPress={() => router.replace('/audit')}
        style={styles.back}
      />
      <AppText variant="title">Your audit results</AppText>
      <AppText variant="caption" weight="semibold" color={colors.muted}>
        {new Date(audit.createdAt).toLocaleString()} ·{' '}
        {audit.source === 'mock' ? 'DEMO RESULT' : 'CLAUDE ANALYSIS'}
      </AppText>

      <View style={styles.scoreWrap}>
        <ScoreRing score={audit.overallScore} />
        <AppText variant="body" center>
          {audit.summary}
        </AppText>
      </View>

      <SectionHeader title="Cleanup actions" />
      <Card style={styles.actionsCard}>
        {audit.cleanupActions.map((action, i) => (
          <View key={i} style={styles.actionRow}>
            <AppText weight="bold" color={colors.primary}>
              {i + 1}.
            </AppText>
            <AppText variant="body" style={styles.actionText}>
              {action}
            </AppText>
          </View>
        ))}
      </Card>

      <SectionHeader title="Item by item" />
      <View style={styles.cards}>
        {audit.verdicts.map((v) => {
          const meta = audit.itemsMeta.find((m) => m.id === v.itemId);
          const flags = v.flags.filter((f) => f !== 'none');
          return (
            <Card key={v.itemId}>
              <View style={styles.itemHeader}>
                {meta?.thumbnailUri ? (
                  <Image source={{ uri: meta.thumbnailUri }} style={styles.thumb} />
                ) : (
                  <View style={styles.textThumb}>
                    <AppText variant="caption" weight="bold" color={colors.muted}>
                      {meta?.kind === 'bio' ? 'BIO' : 'TEXT'}
                    </AppText>
                  </View>
                )}
                <View style={styles.itemHeaderText}>
                  <VerdictBadge verdict={v.verdict} />
                  {flags.length > 0 ? (
                    <AppText variant="caption" weight="semibold" color={colors.muted}>
                      {flags.map((f) => flagLabels[f]).join(' · ')}
                    </AppText>
                  ) : null}
                </View>
              </View>
              {meta?.text ? (
                <AppText variant="small" color={colors.muted} style={styles.quoted}>
                  “{meta.text}”
                </AppText>
              ) : null}
              {v.reasons.map((r, i) => (
                <AppText key={i} variant="small">
                  • {r}
                </AppText>
              ))}
              {v.suggestion ? (
                <AppText variant="small" weight="semibold" color={colors.primaryDark}>
                  → {v.suggestion}
                </AppText>
              ) : null}
            </Card>
          );
        })}
      </View>

      {audit.gridNotes ? (
        <>
          <SectionHeader title="Grid notes" />
          <Card>
            <AppText variant="body">{audit.gridNotes}</AppText>
          </Card>
        </>
      ) : null}

      <Button
        label="Run another audit"
        onPress={() => router.replace('/audit/new')}
        style={styles.cta}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', minHeight: 0, paddingVertical: spacing.sm, paddingHorizontal: 0 },
  scoreWrap: { gap: spacing.lg, marginTop: spacing.xl },
  actionsCard: { gap: spacing.sm },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionText: { flex: 1 },
  cards: { gap: spacing.sm },
  itemHeader: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  itemHeaderText: { gap: spacing.xs, flex: 1 },
  thumb: { width: 64, height: 64, borderRadius: radii.md, backgroundColor: colors.blush },
  textThumb: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoted: { fontStyle: 'italic' },
  cta: { marginTop: spacing.xxl },
});
