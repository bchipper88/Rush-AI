import { roundMeta, RushRound, rushRounds } from '@/features/houses/houseUtils';

export interface RushWeekDay {
  offset: number; // days from the rush anchor (0 = day one)
  round: RushRound | 'bid_day';
  label: string;
  wear: string;
  bring: string;
  reminder: string;
}

/**
 * A typical NPC week. Campuses vary (some run multiple days per round), so
 * this is framed as a guide she can compare against her real schedule.
 */
export const rushWeekPlan: RushWeekDay[] = [
  {
    offset: 0,
    round: 'open_house',
    label: 'Open House',
    wear: 'Campus-casual — sundress or nice top with shorts, comfy shoes you can walk in.',
    bring: 'Water, blister patches, portable charger, powder or blotting papers.',
    reminder: 'Short parties, big energy. Lead with your name, hometown, and one thing you love.',
  },
  {
    offset: 1,
    round: 'philanthropy',
    label: 'Philanthropy',
    wear: 'Elevated casual — many campuses hand out a round T-shirt, so check first.',
    bring: 'Same kit plus a snack. Craft activities mean you may be sitting on the floor.',
    reminder: 'Ask what the cause means to her personally — that is the conversation they remember.',
  },
  {
    offset: 2,
    round: 'sisterhood',
    label: 'Sisterhood',
    wear: 'Polished — a nice dress or coordinated set. House tours mean stairs.',
    bring: 'Notes app ready; this is where fit really shows.',
    reminder: 'Ask the practical questions: dues, time commitment, live-in rules, study support.',
  },
  {
    offset: 3,
    round: 'preference',
    label: 'Preference',
    wear: 'Your dressiest look — cocktail-appropriate, closed-toe if it is cold.',
    bring: 'Tissues. Genuinely.',
    reminder:
      'Tonight is emotional and sincere. Afterward: rank every chapter you attended unless you would truly rather go home.',
  },
  {
    offset: 4,
    round: 'bid_day',
    label: 'Bid Day',
    wear: 'Comfy and cute — you will be running, hugging, and photographed all day.',
    bring: 'Charged phone, sunscreen, water.',
    reminder: 'However today lands, you did the hard part. Go celebrate.',
  },
];

export function isRushWeek(daysUntilRush: number): boolean {
  return daysUntilRush <= 7 && daysUntilRush >= -7;
}

/** Which plan day matches today, if any. */
export function currentRushDay(daysUntilRush: number): RushWeekDay | null {
  const offset = -daysUntilRush; // day 0 is the anchor
  return rushWeekPlan.find((d) => d.offset === offset) ?? null;
}

export function roundLabel(round: RushRound | 'bid_day'): string {
  return round === 'bid_day' ? '🎉 Bid Day' : `${roundMeta[round].emoji} ${roundMeta[round].label}`;
}

export const allRushRounds = rushRounds;
