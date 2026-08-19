import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { track } from '@/lib/analytics';
import { useProfileStore } from '@/state/profileStore';
import { colors, spacing } from '@/theme';

export default function DoneStep() {
  const draft = useOnboardingDraft();
  const setProfile = useProfileStore((s) => s.setProfile);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfile({
        name: draft.name.trim(),
        schoolId: draft.schoolId,
        customSchoolName: draft.customSchoolName.trim() || undefined,
        customSchoolDomain: draft.customSchoolDomain.trim() || undefined,
        priorities: draft.priorities,
        rushYear: draft.rushYear,
        rushSeason: draft.rushSeason ?? undefined,
        targetDate: draft.targetDate ?? undefined,
        gpa: draft.gpa.trim() || undefined,
        activities: draft.activities.trim() || undefined,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      });
      track('onboarding_completed', {
        schoolId: draft.schoolId,
        rushYear: draft.rushYear,
        season: draft.rushSeason,
        hasTargetDate: !!draft.targetDate,
        priorities: draft.priorities.join(','),
        hasGpa: !!draft.gpa.trim(),
      });
      draft.resetDraft();
      router.replace('/(tabs)');
    }, 2200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[colors.blush, colors.primarySoft]}
      style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <AppText variant="hero" center>
          🎀
        </AppText>
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(300).duration(600)}>
        <AppText variant="title" center>
          Building your game plan…
        </AppText>
        <AppText variant="body" color={colors.primaryDark} center style={styles.sub}>
          Personalizing your checklist, timeline, and coach tips
        </AppText>
        <AppText variant="caption" color={colors.primaryDark} center style={styles.sub}>
          Anonymous usage stats help us improve Rush AI — manage this anytime in Profile.
        </AppText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
  },
  sub: { marginTop: spacing.sm },
});
