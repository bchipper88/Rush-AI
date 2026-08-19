import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ProgressDots } from '@/components/ProgressDots';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export const ONBOARDING_STEPS = 5;

interface OnboardingStepProps {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onNext: () => void;
  onSkip?: () => void;
}

export function OnboardingStep({
  step,
  title,
  subtitle,
  children,
  ctaLabel = 'Continue',
  ctaDisabled,
  onNext,
  onSkip,
}: OnboardingStepProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen scroll={false} safeTop>
        <ProgressDots total={ONBOARDING_STEPS} current={step} />
        <Animated.View
          key={`step-${step}`}
          entering={FadeInDown.duration(400)}
          style={styles.body}>
          <AppText variant="title">{title}</AppText>
          {subtitle ? (
            <AppText variant="body" color={colors.muted}>
              {subtitle}
            </AppText>
          ) : null}
          <View style={styles.content}>{children}</View>
        </Animated.View>
        <View style={styles.footer}>
          <Button label={ctaLabel} onPress={onNext} disabled={ctaDisabled} />
          {onSkip ? <Button label="Skip for now" variant="ghost" onPress={onSkip} /> : null}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, gap: spacing.md, paddingTop: spacing.xxl },
  content: { flex: 1, marginTop: spacing.lg },
  footer: { gap: spacing.sm },
});
