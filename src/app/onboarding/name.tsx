import { router } from 'expo-router';

import { OnboardingStep } from '@/components/OnboardingStep';
import { SearchInput } from '@/components/SearchInput';
import { useOnboardingDraft } from '@/features/onboarding/useOnboardingDraft';

export default function NameStep() {
  const name = useOnboardingDraft((s) => s.name);
  const setName = useOnboardingDraft((s) => s.setName);

  return (
    <OnboardingStep
      step={0}
      title="Hey, future new member 🎀"
      subtitle="Let's build your personal rush game plan. First — what should we call you?"
      ctaDisabled={name.trim().length === 0}
      onNext={() => router.push('/onboarding/age')}>
      <SearchInput
        placeholder="Your first name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
        returnKeyType="done"
      />
    </OnboardingStep>
  );
}
