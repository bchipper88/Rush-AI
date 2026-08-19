import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { OnboardingStep } from '@/components/OnboardingStep';
import { MINIMUM_AGE } from '@/config/policy';
import { ageFromBirthDate, defaultBirthDate } from '@/features/onboarding/age';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { toISODate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

export default function AgeStep() {
  const birthDate = useOnboardingDraft((s) => s.birthDate);
  const setBirthDate = useOnboardingDraft((s) => s.setBirthDate);
  const [touched, setTouched] = useState(!!birthDate);

  const value = birthDate
    ? new Date(
        Number(birthDate.slice(0, 4)),
        Number(birthDate.slice(5, 7)) - 1,
        Number(birthDate.slice(8, 10)),
      )
    : defaultBirthDate();
  const age = birthDate ? ageFromBirthDate(birthDate) : null;
  const isMinor = age !== null && age < MINIMUM_AGE;

  return (
    <OnboardingStep
      step={1}
      title="When's your birthday? 🎂"
      subtitle="We use this to keep guidance age-appropriate — it stays on your phone."
      ctaDisabled={!touched}
      onNext={() => router.push('/onboarding/school')}>
      <View style={styles.picker}>
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          themeVariant="light"
          maximumDate={new Date()}
          onChange={(_, date) => {
            if (date) {
              setBirthDate(toISODate(date));
              setTouched(true);
            }
          }}
        />
      </View>

      {age !== null ? (
        <Card style={styles.card}>
          <AppText weight="semibold">
            {isMinor ? '💗 Good to know' : `🎉 ${age} years old`}
          </AppText>
          <AppText variant="small" color={colors.muted}>
            {isMinor
              ? `You're under ${MINIMUM_AGE}, so we'll keep the coaching extra age-appropriate — and we'd love for you to go through this with a parent or guardian.`
              : 'Perfect — your coach will talk to you like the adult you are.'}
          </AppText>
        </Card>
      ) : null}
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  picker: { alignItems: 'center' },
  card: { marginTop: spacing.lg, gap: spacing.xs },
});
