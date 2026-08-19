import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { checkHealth, isMockMode } from '@/features/audit/auditClient';
import {
  resolveRushAnchor,
  resolveSchool,
  schoolSeason,
} from '@/features/checklist/buildChecklist';
import { formatFullDate } from '@/lib/dates';
import { OutcomeCheckIn } from '@/components/OutcomeCheckIn';
import { useAnalyticsStore } from '@/lib/analytics';
import { useAuditStore } from '@/state/auditStore';
import { useChecklistStore } from '@/state/checklistStore';
import { useProfileStore } from '@/state/profileStore';
import { colors, spacing } from '@/theme';

const priorityLabels: Record<string, string> = {
  sisterhood: 'Sisterhood',
  philanthropy: 'Philanthropy',
  social: 'Social life',
  academics: 'Academics',
  leadership: 'Leadership',
  networking: 'Networking',
  legacy: 'Family tradition',
};

export default function ProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const resetProfile = useProfileStore((s) => s.resetProfile);
  const resetChecklist = useChecklistStore((s) => s.resetChecklist);
  const clearAudits = useAuditStore((s) => s.clearHistory);
  const analyticsEnabled = useAnalyticsStore((s) => s.enabled);
  const setAnalyticsEnabled = useAnalyticsStore((s) => s.setEnabled);
  const [aiConnected, setAiConnected] = useState<boolean | null>(
    isMockMode() ? false : null,
  );

  useEffect(() => {
    let cancelled = false;
    if (isMockMode()) {
      return;
    }
    checkHealth().then((ok) => {
      if (!cancelled) setAiConnected(ok);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!profile) return null;

  const school = resolveSchool(profile);
  const schoolLabel =
    profile.customSchoolName && profile.schoolId === 'custom'
      ? profile.customSchoolName
      : school.name;

  const handleReset = () => {
    Alert.alert(
      'Start over?',
      'This clears your profile, checklist progress, and audit history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            resetProfile();
            resetChecklist();
            clearAudits();
            router.replace('/onboarding/name');
          },
        },
      ],
    );
  };

  return (
    <Screen safeTop>
      <AppText variant="title">{profile.name}</AppText>
      <AppText variant="body" color={colors.muted}>
        Rushing {schoolLabel} · {profile.rushYear}
      </AppText>

      <SectionHeader title="Your answers" />
      <View style={styles.cards}>
        <Card>
          <AppText variant="caption" weight="semibold" color={colors.muted}>
            SCHOOL
          </AppText>
          <AppText weight="semibold">{schoolLabel}</AppText>
          <AppText variant="small" color={colors.muted}>
            {(profile.rushSeason ?? schoolSeason(school)) === 'spring'
              ? 'Spring rush'
              : 'Fall rush'}{' '}
            {profile.targetDate
              ? `· starts ${formatFullDate(resolveRushAnchor(profile, school))}`
              : `· ${profile.rushYear}`}{' '}
            ·{' '}
            {school.recs === 'not_used'
              ? 'no rec letters needed'
              : school.recs === 'required'
                ? 'rec letters expected'
                : 'rec letters helpful'}
          </AppText>
        </Card>
        <Card>
          <AppText variant="caption" weight="semibold" color={colors.muted}>
            PRIORITIES
          </AppText>
          <AppText weight="semibold">
            {profile.priorities.map((p) => priorityLabels[p] ?? p).join(' · ')}
          </AppText>
        </Card>
        {profile.gpa ? (
          <Card>
            <AppText variant="caption" weight="semibold" color={colors.muted}>
              GPA
            </AppText>
            <AppText weight="semibold">{profile.gpa}</AppText>
          </Card>
        ) : null}
      </View>

      <SectionHeader title="Your rush outcome" />
      <OutcomeCheckIn />

      <SectionHeader title="AI status" />
      <Card>
        <AppText weight="semibold">
          {aiConnected === null
            ? '⏳ Checking…'
            : aiConnected
              ? '🟢 AI connected'
              : '🎀 Demo mode'}
        </AppText>
        <AppText variant="small" color={colors.muted}>
          {aiConnected
            ? 'Audits run through your Rush AI server with real Claude analysis.'
            : 'Audits return sample results. To enable real analysis, run the Rush AI server on your Mac and set EXPO_PUBLIC_API_URL — see the project README.'}
        </AppText>
      </Card>

      <SectionHeader title="Data & privacy" />
      <Card>
        <View style={styles.toggleRow}>
          <View style={styles.toggleText}>
            <AppText weight="semibold">Share anonymous usage data</AppText>
            <AppText variant="small" color={colors.muted}>
              Helps us improve Rush AI. Never includes your name, photos, or messages —
              just anonymous events like &ldquo;audit completed.&rdquo;
            </AppText>
          </View>
          <Switch
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </Card>

      <SectionHeader title="Manage" />
      <Button label="Redo onboarding" variant="secondary" onPress={() => router.push('/onboarding/name')} />
      <Button label="Reset everything" variant="ghost" onPress={handleReset} style={styles.reset} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cards: { gap: spacing.sm },
  reset: { marginTop: spacing.sm },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  toggleText: { flex: 1, gap: 2 },
});
