import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  /** apply the top safe-area inset (use on screens without a header) */
  safeTop?: boolean;
}

export function Screen({ children, scroll = true, padded = true, style, safeTop }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const base: ViewStyle = {
    flexGrow: 1,
    paddingTop: safeTop ? insets.top + spacing.lg : undefined,
    paddingHorizontal: padded ? spacing.xl : 0,
    paddingBottom: insets.bottom + spacing.xl,
  };

  if (!scroll) {
    return <View style={[styles.root, base, style]}>{children}</View>;
  }
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[base, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
});
