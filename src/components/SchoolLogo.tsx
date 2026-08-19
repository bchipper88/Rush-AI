import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii } from '@/theme';

interface SchoolLogoProps {
  domain?: string;
  size?: number;
}

/** School logo pulled from the school's website favicon, with a 🎓 fallback. */
export function SchoolLogo({ domain, size = 40 }: SchoolLogoProps) {
  const [failed, setFailed] = useState(false);
  const box = {
    width: size,
    height: size,
    borderRadius: radii.sm,
  };

  if (!domain || failed) {
    return (
      <View style={[styles.fallback, box]}>
        <AppText style={{ fontSize: size * 0.55, lineHeight: size * 0.7 }}>🎓</AppText>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: `https://www.google.com/s2/favicons?domain=${domain}&sz=128` }}
      style={[styles.logo, box]}
      contentFit="contain"
      transition={150}
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  logo: { backgroundColor: colors.white },
  fallback: {
    backgroundColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
