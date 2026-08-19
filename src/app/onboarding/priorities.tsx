import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { OnboardingStep } from '@/components/OnboardingStep';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';
import { spacing } from '@/theme';
import type { Priority } from '@/types';

const priorityOptions: { key: Priority; label: string }[] = [
  { key: 'sisterhood', label: 'Genuine sisterhood 💕' },
  { key: 'philanthropy', label: 'Service & philanthropy 🤝' },
  { key: 'social', label: 'Social life & events 🎉' },
  { key: 'academics', label: 'Academic support 📚' },
  { key: 'leadership', label: 'Leadership roles 🌟' },
  { key: 'networking', label: 'Career networking 💼' },
  { key: 'legacy', label: 'Family tradition 👩‍👧' },
];

export default function PrioritiesStep() {
  const priorities = useOnboardingDraft((s) => s.priorities);
  const togglePriority = useOnboardingDraft((s) => s.togglePriority);

  return (
    <OnboardingStep
      step={3}
      title="What matters most to you?"
      subtitle="Pick as many as you like — we'll tune your plan and tips around them."
      ctaDisabled={priorities.length === 0}
      onNext={() => router.push('/onboarding/timeline')}>
      <View style={styles.wrap}>
        {priorityOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={opt.label}
            selected={priorities.includes(opt.key)}
            onPress={() => togglePriority(opt.key)}
          />
        ))}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
