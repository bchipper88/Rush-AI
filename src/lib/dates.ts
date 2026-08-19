const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** First day of the rush anchor month. */
export function rushAnchorDate(rushYear: number, rushMonth: number): Date {
  return new Date(rushYear, rushMonth - 1, 1);
}

/** Subtract whole months, keeping day = 1 (safe across year boundaries). */
export function monthsBefore(anchor: Date, months: number): Date {
  return new Date(anchor.getFullYear(), anchor.getMonth() - months, 1);
}

export function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatFullDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function toISODate(date: Date): string {
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Whole days from `from` until `to` (negative when past). */
export function daysUntil(to: Date, from: Date = new Date()): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
