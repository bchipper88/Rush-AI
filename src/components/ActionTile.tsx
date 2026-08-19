import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radii, spacing } from '@/theme';

interface ActionTileProps {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** Headspace-style quick action tile: 140×180, big illustration, press scale. */
export function ActionTile({ emoji, title, subtitle, onPress }: ActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <AppText style={styles.emoji}>{emoji}</AppText>
      <AppText variant="body" weight="semibold" numberOfLines={2}>
        {title}
      </AppText>
      <AppText variant="caption" color={colors.muted} numberOfLines={2}>
        {subtitle}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 140,
    height: 180,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: { transform: [{ scale: 0.98 }] },
  emoji: { fontSize: 40, lineHeight: 48, marginBottom: spacing.sm, borderRadius: radii.sm },
});
