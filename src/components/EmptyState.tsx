import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, spacing } from '@/theme';

interface EmptyStateProps {
  emoji: string;
  title: string;
  message: string;
}

export function EmptyState({ emoji, title, message }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="hero" center>
        {emoji}
      </AppText>
      <AppText variant="subheading" weight="semibold" center>
        {title}
      </AppText>
      <AppText variant="body" color={colors.muted} center>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
});
