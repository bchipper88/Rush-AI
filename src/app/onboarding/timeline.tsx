import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { OnboardingStep } from '@/components/OnboardingStep';
import { CUSTOM_SCHOOL_ID, defaultSchool, getSchoolById } from '@/content/schools';
import {
  resolveRushAnchor,
  schoolSeason,
} from '@/features/checklist/buildChecklist';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { formatFullDate, formatMonthYear, toISODate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

export default function TimelineStep() {
  const rushYear = useOnboardingDraft((s) => s.rushYear);
  const rushSeason = useOnboardingDraft((s) => s.rushSeason);
  const targetDate = useOnboardingDraft((s) => s.targetDate);
  const setRushYear = useOnboardingDraft((s) => s.setRushYear);
  const setRushSeason = useOnboardingDraft((s) => s.setRushSeason);
  const setTargetDate = useOnboardingDraft((s) => s.setTargetDate);
  const schoolId = useOnboardingDraft((s) => s.schoolId);
  const customSchoolName = useOnboardingDraft((s) => s.customSchoolName);

  const school = getSchoolById(schoolId);
  const scheduleKnown = !!school && schoolId !== CUSTOM_SCHOOL_ID;
  // Known school: default the season to its usual schedule. Unknown: make her choose.
  const season = rushSeason ?? (scheduleKnown ? schoolSeason(school) : null);

  const thisYear = new Date().getFullYear();
  const yearOptions = [thisYear, thisYear + 1, thisYear + 2];

  const anchorProfile = {
    rushYear,
    rushSeason: season ?? undefined,
    targetDate: targetDate ?? undefined,
  };
  const effectiveAnchor = season
    ? resolveRushAnchor(anchorProfile, school ?? defaultSchool)
    : null;

  const schoolLabel = scheduleKnown ? school.shortName : customSchoolName || 'your school';

  return (
    <OnboardingStep
      step={4}
      title="When are you rushing?"
      subtitle={
        scheduleKnown
          ? `We've pre-filled ${schoolLabel}'s usual season — adjust anything that doesn't match your plan.`
          : `We don't have ${schoolLabel}'s schedule on file, so tell us — your campus Panhellenic site will say.`
      }
      ctaDisabled={!season}
      onNext={() => router.push('/onboarding/academics')}>
      <AppText variant="small" weight="semibold" color={colors.muted}>
        SEASON
      </AppText>
      <View style={styles.chipRow}>
        <Chip
          label="☀️ Fall rush"
          selected={season === 'fall'}
          onPress={() => setRushSeason('fall')}
        />
        <Chip
          label="❄️ Spring rush"
          selected={season === 'spring'}
          onPress={() => setRushSeason('spring')}
        />
      </View>

      <AppText variant="small" weight="semibold" color={colors.muted} style={styles.label}>
        YEAR
      </AppText>
      <View style={styles.chipRow}>
        {yearOptions.map((y) => (
          <Chip key={y} label={`${y}`} selected={rushYear === y} onPress={() => setRushYear(y)} />
        ))}
      </View>

      <AppText variant="small" weight="semibold" color={colors.muted} style={styles.label}>
        EXACT START DATE (OPTIONAL)
      </AppText>
      <View style={styles.chipRow}>
        <Chip
          label={targetDate ? '📅 Date set' : '📅 I know my exact date'}
          selected={!!targetDate}
          onPress={() => {
            if (targetDate) {
              setTargetDate(null);
            } else if (effectiveAnchor) {
              setTargetDate(toISODate(effectiveAnchor));
            }
          }}
        />
      </View>
      {targetDate && effectiveAnchor ? (
        <DateTimePicker
          value={effectiveAnchor}
          mode="date"
          display="spinner"
          themeVariant="light"
          onChange={(_, date) => {
            if (date) setTargetDate(toISODate(date));
          }}
        />
      ) : null}

      {season && effectiveAnchor ? (
        <Card style={styles.infoCard}>
          <AppText weight="semibold">
            {season === 'spring' ? '❄️ Spring recruitment' : '☀️ Fall recruitment'}
          </AppText>
          <AppText variant="small" color={colors.muted}>
            {targetDate
              ? `Your plan counts down to ${formatFullDate(effectiveAnchor)}.`
              : `We'll plan around ${formatMonthYear(effectiveAnchor)}${
                  scheduleKnown ? '' : ' — set the exact date once your Panhellenic announces it'
                }.`}{' '}
            {season === 'spring'
              ? 'Deferred rush means your first college semester counts — grades and real connections are your prep.'
              : 'Fall rush means prep happens the spring and summer before — recs, materials, and social cleanup early.'}
          </AppText>
        </Card>
      ) : null}
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
  label: { marginTop: spacing.xl },
  infoCard: { marginTop: spacing.xl, gap: spacing.xs },
});
