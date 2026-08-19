import { Redirect } from 'expo-router';

import { useProfileStore } from '@/state/profileStore';

export default function Index() {
  const profile = useProfileStore((s) => s.profile);
  if (profile?.onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/onboarding/name" />;
}
