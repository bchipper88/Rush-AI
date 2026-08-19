import { router } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Screen } from '@/components/Screen';
import { MINIMUM_AGE } from '@/config/policy';
import { canUseAiChat } from '@/features/onboarding/age';
import { useProfileStore } from '@/state/profileStore';
import { colors, spacing } from '@/theme';

/**
 * Wraps the conversational-AI surfaces. Under the current 'soft' policy this
 * always renders children; flipping AGE_ENFORCEMENT to 'hard' in
 * src/config/policy.ts turns it into a real gate with no other code changes.
 */
export function AgeGate({ children }: { children: ReactNode }) {
  const profile = useProfileStore((s) => s.profile);
  if (canUseAiChat(profile)) return <>{children}</>;

  return (
    <Screen safeTop>
      <EmptyState
        emoji="💗"
        title={`Chat opens at ${MINIMUM_AGE}`}
        message={`The AI coach is built for ${MINIMUM_AGE}+ right now — but everything else in Rush AI is yours: your plan, the coach guides, outfit and budget help, and the glossary.`}
      />
      <AppText variant="small" color={colors.muted} center style={styles.note}>
        Going through recruitment with a parent or guardian is a great idea at any age.
      </AppText>
      <Button label="Back to my plan" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: { marginBottom: spacing.xl },
});
