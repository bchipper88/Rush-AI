import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { OnboardingStep } from '@/components/OnboardingStep';
import { defaultSchool, getSchoolById } from '@/content/schools';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { formatMonthYear, rushAnchorDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

export default function TimelineStep() {
  const rushYear = useOnboardingDraft((s) => s.rushYear);
  const setRushYear = useOnboardingDraft((s) => s.setRushYear);
  const schoolId = useOnboardingDraft((s) => s.schoolId);
  const school = getSchoolById(schoolId) ?? defaultSchool;

  const thisYear = new Date().getFullYear();
  const yearOptions = [thisYear, thisYear + 1, thisYear + 2];
  const anchor = rushAnchorDate(rushYear, school.rushMonth);

  return (
    <OnboardingStep
      step={3}
      title="When are you rushing?"
      subtitle="Pick the year — we'll anchor your timeline to your school's recruitment season."
      onNext={() => router.push('/onboarding/academics')}>
      <View style={styles.years}>
        {yearOptions.map((y) => (
          <Chip
            key={y}
            label={`${y}`}
            selected={rushYear === y}
            onPress={() => setRushYear(y)}
          />
        ))}
      </View>
      <Card style={styles.infoCard}>
        <AppText weight="semibold">
          {school.style === 'deferred_spring' ? '❄️ Spring recruitment' : '☀️ Fall recruitment'}
        </AppText>
        <AppText variant="small" color={colors.muted}>
          {school.shortName} rushes around {formatMonthYear(anchor)}.{' '}
          {school.style === 'deferred_spring'
            ? 'Deferred rush means your first college semester counts — grades and real connections are your prep.'
            : 'Fall rush means prep happens the spring and summer before — recs, materials, and social cleanup early.'}
        </AppText>
      </Card>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  years: { flexDirection: 'row', gap: spacing.sm },
  infoCard: { marginTop: spacing.xl, gap: spacing.xs },
});
