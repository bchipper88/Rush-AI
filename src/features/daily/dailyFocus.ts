import { articles } from '@/content/articles';
import type { GeneratedChecklistItem } from '@/types';

export interface DailyFocus {
  /** the one task to nudge today (null when everything is done) */
  task: GeneratedChecklistItem | null;
  tip: { slug: string; title: string; text: string };
  /** stable greeting so the card doesn't churn within a day */
  greeting: string;
}

const GREETINGS = [
  'Today’s focus',
  'One thing today',
  'Your daily rep',
  'Small step, big week',
  'Today’s move',
];

/**
 * Deterministic hash so the same day always yields the same card.
 * djb2 alone leaves consecutive dates sharing low bits (so `% n` picked the
 * same slot every day) — the avalanche step below mixes them apart.
 */
export function hashDay(dayKey: string, salt = ''): number {
  const input = `${dayKey}|${salt}`;
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519) >>> 0;
  h ^= h >>> 13;
  h = Math.imul(h, 3266489917) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/** Short, self-contained tips pulled from the article library's callouts. */
function tipPool(): { slug: string; title: string; text: string }[] {
  const tips: { slug: string; title: string; text: string }[] = [];
  for (const article of articles) {
    for (const block of article.blocks) {
      if (block.type === 'callout' && block.tone === 'tip' && block.text.length <= 220) {
        tips.push({ slug: article.slug, title: article.title, text: block.text });
      }
    }
  }
  return tips;
}

/**
 * The daily card: her most urgent undone task plus a rotating micro-tip.
 * Deterministic per (day, profile) so it never changes under her mid-day,
 * and rotates as the date advances.
 */
export function buildDailyFocus(
  items: GeneratedChecklistItem[],
  done: Record<string, boolean>,
  dayKey: string,
  salt = '',
): DailyFocus {
  const undone = items.filter((i) => !done[i.id]);
  const hash = hashDay(dayKey, salt);
  const tips = tipPool();

  // Rotate through the few most urgent tasks so it isn't the same card daily
  const candidates = undone.slice(0, 3);
  const task = candidates.length > 0 ? candidates[hash % candidates.length] : null;

  return {
    task,
    tip: tips.length > 0 ? tips[hash % tips.length] : { slug: '', title: '', text: '' },
    greeting: GREETINGS[hash % GREETINGS.length],
  };
}
