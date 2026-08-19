import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OnboardingStep } from '@/components/OnboardingStep';
import { SearchInput } from '@/components/SearchInput';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { spacing } from '@/theme';

export default function AcademicsStep() {
  const gpa = useOnboardingDraft((s) => s.gpa);
  const activities = useOnboardingDraft((s) => s.activities);
  const setAcademics = useOnboardingDraft((s) => s.setAcademics);

  return (
    <OnboardingStep
      step={4}
      title="A little about you"
      subtitle="Optional — but chapters do screen grades, and activities fuel your social résumé."
      ctaLabel="Finish"
      onNext={() => router.push('/onboarding/done')}
      onSkip={() => router.push('/onboarding/done')}>
      <View style={styles.fields}>
        <SearchInput
          placeholder="GPA (e.g. 3.8)"
          value={gpa}
          onChangeText={(t) => setAcademics(t, activities)}
          keyboardType="decimal-pad"
        />
        <SearchInput
          placeholder="Activities & leadership (cheer captain, NHS, part-time job…)"
          value={activities}
          onChangeText={(t) => setAcademics(gpa, t)}
          autoCapitalize="sentences"
          multiline
          style={styles.multiline}
        />
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.md },
  multiline: { minHeight: 100, textAlignVertical: 'top' },
});
