import { Text, TextProps, TextStyle } from 'react-native';

import { colors, fonts, fontSizes } from '@/theme';

type Variant = 'hero' | 'title' | 'heading' | 'subheading' | 'body' | 'small' | 'caption';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

interface AppTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  color?: string;
  center?: boolean;
}

const displayVariants: Variant[] = ['hero', 'title'];

const weightFont: Record<Weight, string> = {
  regular: fonts.body,
  medium: fonts.bodyMedium,
  semibold: fonts.bodySemiBold,
  bold: fonts.bodyBold,
};

export function AppText({
  variant = 'body',
  weight = 'regular',
  color = colors.ink,
  center,
  style,
  ...rest
}: AppTextProps) {
  const isDisplay = displayVariants.includes(variant);
  const tightSpacing: Partial<Record<Variant, number>> = {
    hero: -0.4,
    title: -0.3,
    heading: -0.2,
    subheading: -0.1,
    caption: 0.4,
  };
  const base: TextStyle = {
    fontFamily: isDisplay ? fonts.display : weightFont[weight],
    fontSize: fontSizes[variant],
    color,
    lineHeight: fontSizes[variant] * (isDisplay ? 1.15 : 1.45),
    letterSpacing: tightSpacing[variant],
    textAlign: center ? 'center' : undefined,
  };
  return <Text style={[base, style]} {...rest} />;
}
