export const colors = {
  // Brand
  primary: '#EC4899',
  primaryDark: '#BE185D',
  primarySoft: '#F9A8D4',
  blush: '#FDF2F8',
  cream: '#FFF7FA',
  white: '#FFFFFF',

  // Text
  ink: '#3B3340',
  muted: '#8E8393',
  faint: '#C4BCC9',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#8B5CF6',

  // Surfaces
  card: '#FFFFFF',
  border: '#F5D8E7',
  overlay: 'rgba(59, 51, 64, 0.45)',

  // Audit verdicts
  verdictKeep: '#10B981',
  verdictEdit: '#F59E0B',
  verdictArchive: '#8B5CF6',
  verdictDelete: '#EF4444',
} as const;

export type AppColor = keyof typeof colors;
