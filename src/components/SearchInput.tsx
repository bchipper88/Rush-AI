import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors, fonts, fontSizes, radii, spacing } from '@/theme';

export function SearchInput({ style, ...props }: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      autoCorrect={false}
      autoCapitalize="none"
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    fontFamily: fonts.body,
    fontSize: fontSizes.body,
    color: colors.ink,
  },
});
