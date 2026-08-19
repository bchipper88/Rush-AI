import type { Phase } from '@/types';

export const phaseOrder: Phase[] = [
  'register',
  'recs',
  'materials',
  'social_media',
  'wardrobe',
  'week_of',
  'during_rounds',
  'bid_day',
];

export const phaseMeta: Record<Phase, { label: string; emoji: string }> = {
  register: { label: 'Get Registered', emoji: '📝' },
  recs: { label: 'Rec Letters', emoji: '💌' },
  materials: { label: 'Your Materials', emoji: '📸' },
  social_media: { label: 'Social Media', emoji: '📱' },
  wardrobe: { label: 'Wardrobe', emoji: '👗' },
  week_of: { label: 'Week Of', emoji: '🎀' },
  during_rounds: { label: 'During Rounds', emoji: '💬' },
  bid_day: { label: 'Bid Day', emoji: '🎉' },
};
