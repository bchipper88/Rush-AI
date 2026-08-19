export type RushRound = 'open_house' | 'philanthropy' | 'sisterhood' | 'preference';

export const rushRounds: RushRound[] = [
  'open_house',
  'philanthropy',
  'sisterhood',
  'preference',
];

export const roundMeta: Record<RushRound, { label: string; short: string; emoji: string }> = {
  open_house: { label: 'Open House', short: 'Open', emoji: '👋' },
  philanthropy: { label: 'Philanthropy', short: 'Phil', emoji: '🤝' },
  sisterhood: { label: 'Sisterhood', short: 'Sis', emoji: '💕' },
  preference: { label: 'Preference', short: 'Pref', emoji: '🕯️' },
};

/** Later rounds are longer and more revealing, so they weigh more in ranking. */
const ROUND_WEIGHT: Record<RushRound, number> = {
  open_house: 1,
  philanthropy: 1.5,
  sisterhood: 2,
  preference: 3,
};

export type HouseStatus = 'interested' | 'invited_back' | 'released' | 'withdrew';

export interface RoundLog {
  attended: boolean;
  rating: number; // 0-5, 0 = unrated
  vibes: string[];
  notes: string;
}

export interface TrackedHouse {
  id: string;
  name: string;
  nickname?: string;
  custom?: boolean;
  status: HouseStatus;
  rounds: Partial<Record<RushRound, RoundLog>>;
}

export function emptyRoundLog(): RoundLog {
  return { attended: true, rating: 0, vibes: [], notes: '' };
}

export function isActive(house: TrackedHouse): boolean {
  return house.status === 'interested' || house.status === 'invited_back';
}

export function activeHouses(houses: TrackedHouse[]): TrackedHouse[] {
  return houses.filter(isActive);
}

export function releasedHouses(houses: TrackedHouse[]): TrackedHouse[] {
  return houses.filter((h) => !isActive(h));
}

export function attendedRounds(house: TrackedHouse): RushRound[] {
  return rushRounds.filter((r) => house.rounds[r]?.attended);
}

/**
 * Weighted score of a house from her own logs: later rounds count more, and
 * a house with no ratings scores 0 (it sorts below anything she rated).
 */
export function houseScore(house: TrackedHouse): number {
  let weighted = 0;
  let weight = 0;
  for (const round of rushRounds) {
    const log = house.rounds[round];
    if (!log?.attended || log.rating <= 0) continue;
    weighted += log.rating * ROUND_WEIGHT[round];
    weight += ROUND_WEIGHT[round];
  }
  return weight === 0 ? 0 : weighted / weight;
}

function noteVolume(house: TrackedHouse): number {
  return rushRounds.reduce((sum, r) => sum + (house.rounds[r]?.notes.trim().length ?? 0), 0);
}

/**
 * Suggested MRABA order: her own weighted ratings first, ties broken by how
 * much she had to say about the house. Only houses still in play are ranked.
 */
export function suggestPrefRanking(houses: TrackedHouse[]): TrackedHouse[] {
  return [...activeHouses(houses)].sort((a, b) => {
    const diff = houseScore(b) - houseScore(a);
    if (Math.abs(diff) > 0.001) return diff;
    const notes = noteVolume(b) - noteVolume(a);
    if (notes !== 0) return notes;
    return a.name.localeCompare(b.name);
  });
}

export interface MaximizeWarning {
  severity: 'none' | 'caution' | 'danger';
  message: string;
}

/**
 * The MRABA safety rule. Listing fewer chapters than you attended at Pref
 * removes safety nets without improving your odds at your favorite — the
 * matching algorithm pairs you with your highest-ranked chapter that also
 * ranked you.
 */
export function maximizeOptionsWarning(
  attendedCount: number,
  listedCount: number,
): MaximizeWarning {
  if (attendedCount <= 1 || listedCount >= attendedCount) {
    return {
      severity: 'none',
      message:
        'You are maximizing your options — this is the only strategy that guarantees a bid if a chapter that ranked you has room.',
    };
  }
  if (listedCount <= 1) {
    return {
      severity: 'danger',
      message:
        'Listing only one chapter ("single intentional preference") does not improve your odds there — it only removes your safety net. If that list fills before it reaches you, you go home with no bid.',
    };
  }
  return {
    severity: 'caution',
    message: `You attended ${attendedCount} Pref events but listed ${listedCount}. Every chapter you leave off is a bid you are choosing to give up. Only drop a house if you would truly rather rush again next year.`,
  };
}

/** How far through the week she is, for progress UI. */
export function roundProgress(houses: TrackedHouse[]): {
  round: RushRound;
  logged: number;
  attended: number;
}[] {
  return rushRounds.map((round) => {
    const attended = houses.filter((h) => h.rounds[round]?.attended).length;
    const logged = houses.filter(
      (h) => h.rounds[round]?.attended && (h.rounds[round]?.rating ?? 0) > 0,
    ).length;
    return { round, logged, attended };
  });
}

/** Compact summary the AI coach can reason over. */
export function houseSummaryForCoach(houses: TrackedHouse[]): string {
  if (houses.length === 0) return 'No houses tracked yet.';
  const active = suggestPrefRanking(houses);
  const out = active
    .slice(0, 8)
    .map((h) => `${h.name} (score ${houseScore(h).toFixed(1)}/5, ${attendedRounds(h).length} rounds)`)
    .join('; ');
  const cut = releasedHouses(houses).length;
  return `Still in play: ${out || 'none'}. Released/withdrew: ${cut}.`;
}
