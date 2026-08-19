import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { isMockMode } from '@/features/audit/auditClient';
import { useAuditStore } from '@/state/auditStore';
import { colors, spacing } from '@/theme';

function scoreColor(score: number): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.danger;
}

export default function AuditHubScreen() {
  const history = useAuditStore((s) => s.history);

  return (
    <Screen safeTop>
      <AppText variant="title">Social Audit</AppText>
      <AppText variant="body" color={colors.muted}>
        Chapters review PNM profiles during pre-screening. See your photos and captions
        the way a recruitment committee will — before they do.
      </AppText>
      {isMockMode() ? (
        <AppText variant="caption" weight="semibold" color={colors.info}>
          Demo mode — connect the Rush AI server for real Claude analysis
        </AppText>
      ) : null}

      <Button
        label="Start a new audit"
        onPress={() => router.push('/audit/new')}
        style={styles.cta}
      />

      <SectionHeader title="Past audits" />
      {history.length === 0 ? (
        <EmptyState
          emoji="📱"
          title="No audits yet"
          message="Pick a few photos from your camera roll and paste your bio — you'll get keep/edit/archive/delete verdicts in about a minute."
        />
      ) : (
        <View style={styles.cards}>
          {history.map((audit) => (
            <Card key={audit.id} onPress={() => router.push(`/audit/${audit.id}`)}>
              <View style={styles.row}>
                <View style={styles.rowText}>
                  <AppText weight="semibold">
                    {new Date(audit.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </AppText>
                  <AppText variant="small" color={colors.muted}>
                    {audit.itemsMeta.length} items ·{' '}
                    {audit.source === 'mock' ? 'demo result' : 'Claude analysis'}
                  </AppText>
                </View>
                <AppText variant="heading" color={scoreColor(audit.overallScore)}>
                  {Math.round(audit.overallScore)}
                </AppText>
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cta: { marginTop: spacing.xl },
  cards: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1 },
});
