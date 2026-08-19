import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
  normalizeSharedUri,
  useShareIntentSafe,
  useShareStore,
} from '@/features/audit/shareIntent';
import { useProfileStore } from '@/state/profileStore';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const onboarded = useProfileStore((s) => !!s.profile?.onboardingComplete);
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentSafe();
  const setPending = useShareStore((s) => s.setPending);

  useEffect(() => {
    if (fontsLoaded && hasHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, hasHydrated]);

  // Content shared from other apps (Instagram/TikTok/etc.) → jump into an audit
  useEffect(() => {
    if (!hasShareIntent || !hasHydrated || !fontsLoaded) return;
    const files = (shareIntent.files ?? []).map((f) => ({
      uri: normalizeSharedUri(f.path),
      width: f.width ?? undefined,
      height: f.height ?? undefined,
      mimeType: f.mimeType ?? undefined,
    }));
    const text = shareIntent.text ?? shareIntent.webUrl ?? undefined;
    resetShareIntent();
    if (files.length === 0 && !text) return;
    setPending({ files, text });
    if (onboarded) {
      router.push('/audit/new');
    }
  }, [hasShareIntent, hasHydrated, fontsLoaded, shareIntent, resetShareIntent, setPending, onboarded]);

  if (!fontsLoaded || !hasHydrated) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="glossary"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </>
  );
}
