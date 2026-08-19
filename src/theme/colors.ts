export const colors = {
  // Brand
  primary: '#EC4899',
  primaryDark: '#BE185D',
  primarySoft: '#F9A8D4',
  primaryFaint: '#FCE7F0',
  blush: '#FFF0F3',
  cream: '#FFF7FA',
  white: '#FFFFFF',

  // Text (warm charcoal ramp, Flo-style)
  ink: '#1F1A2E',
  muted: '#6E6A82',
  faint: '#A09CB0',

  // Semantic (gentle variants)
  success: '#3FA983',
  warning: '#E8A44E',
  danger: '#E25563',
  info: '#A893D6',

  // Surfaces
  card: '#FFFFFF',
  sunken: '#FBE9ED',
  border: '#F3DDE3',
  overlay: 'rgba(31, 26, 46, 0.45)',

  // Audit verdicts
  verdictKeep: '#3FA983',
  verdictEdit: '#E8A44E',
  verdictArchive: '#A893D6',
  verdictDelete: '#E25563',
} as const;

export type AppColor = keyof typeof colors;
