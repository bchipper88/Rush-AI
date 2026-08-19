import type { ChecklistTemplateItem } from '@/types';

/**
 * Master checklist template. buildChecklist() filters these by the user's
 * school + profile (appliesIf) and converts monthsBeforeRush into real dates.
 */
export const checklistTemplates: ChecklistTemplateItem[] = [
  // ---- register ----
  {
    id: 'register-panhellenic',
    title: 'Register for recruitment',
    detail:
      'Register the day your Panhellenic opens — fees are non-refundable but spots and early materials matter. Have your transcript and a recent photo ready.',
    phase: 'register',
    monthsBeforeRush: 3,
  },
  {
    id: 'calendar-key-dates',
    title: 'Put every key date on your calendar',
    detail:
      'Registration close, orientation/convocation, each round, and Bid Day. Book travel and housing around them now.',
    phase: 'register',
    monthsBeforeRush: 3,
  },
  {
    id: 'read-campus-rules',
    title: 'Read your campus recruitment rules',
    detail:
      'Every Panhellenic publishes its own dress guidance, contact rules, and schedule. Read the official pages — not just TikTok.',
    phase: 'register',
    monthsBeforeRush: 3,
    articleSlug: 'rush-101-how-rounds-work',
  },

  // ---- recs ----
  {
    id: 'recs-identify-writers',
    title: 'Find a rec writer for each chapter',
    detail:
      'Ask family friends, alumnae groups, your mom\'s network, or your local alumnae Panhellenic. One letter per chapter on your campus.',
    phase: 'recs',
    monthsBeforeRush: 5,
    articleSlug: 'rec-letters-by-region',
    appliesIf: { recs: ['required', 'recommended'] },
  },
  {
    id: 'recs-packet',
    title: 'Send your rec writers a packet',
    detail:
      'Give each writer your social résumé, headshot, transcript, and a thank-you note. Make it effortless for them to say yes.',
    phase: 'recs',
    monthsBeforeRush: 4,
    articleSlug: 'social-resume-and-headshot',
    appliesIf: { recs: ['required', 'recommended'] },
  },
  {
    id: 'recs-confirm-submitted',
    title: 'Confirm every rec was submitted',
    detail:
      'Follow up politely ~3 weeks before recruitment. Some schools want recs sent directly to each house (SMU) — double-check where yours go.',
    phase: 'recs',
    monthsBeforeRush: 2,
    appliesIf: { recs: ['required', 'recommended'] },
  },

  // ---- materials ----
  {
    id: 'social-resume',
    title: 'Build your social résumé',
    detail:
      'One page: GPA, activities, leadership, service, work, honors. Used for recs and for chapter pre-screening.',
    phase: 'materials',
    monthsBeforeRush: 4,
    articleSlug: 'social-resume-and-headshot',
  },
  {
    id: 'headshot',
    title: 'Get a clean headshot taken',
    detail:
      'Natural light, simple background, genuine smile. It goes on your registration, résumé, and rec packets.',
    phase: 'materials',
    monthsBeforeRush: 3,
    articleSlug: 'social-resume-and-headshot',
  },
  {
    id: 'transcript-gpa',
    title: 'Order your transcript & know your GPA',
    detail:
      'Chapters screen on grades. Know your number and have the document ready for registration.',
    phase: 'materials',
    monthsBeforeRush: 4,
    articleSlug: 'grades-and-recruitment',
  },
  {
    id: 'gpa-study-plan',
    title: 'Protect your GPA this term',
    detail:
      'Some chapters use GPA as a hard cut line. A strong term now is the cheapest rush prep there is.',
    phase: 'materials',
    monthsBeforeRush: 5,
    articleSlug: 'grades-and-recruitment',
    appliesIf: { priorities: ['academics'] },
  },
  {
    id: 'budget-worksheet',
    title: 'Do the money talk with your family',
    detail:
      'Dues, housing, outfits, travel. At high-cost campuses first-year totals can exceed $8,000 — agree on a budget before Pref, not after.',
    phase: 'materials',
    monthsBeforeRush: 4,
    articleSlug: 'what-sorority-life-costs',
    appliesIf: { minCostTier: 3 },
  },

  // ---- social media ----
  {
    id: 'audit-instagram',
    title: 'Run a social media audit',
    detail:
      'Chapters look at your profiles during pre-screening. Use the Audit tab to review your photos, captions, and bio the way a chapter member would.',
    phase: 'social_media',
    monthsBeforeRush: 2,
    articleSlug: 'instagram-cleanup-guide',
  },
  {
    id: 'clean-up-tagged',
    title: 'Check tagged photos & old posts',
    detail:
      'Untag or hide anything with alcohol, party settings, or content you would not want discussed in a membership-selection meeting.',
    phase: 'social_media',
    monthsBeforeRush: 2,
    articleSlug: 'instagram-cleanup-guide',
  },
  {
    id: 'decide-posting-plan',
    title: 'Decide your rush-week posting plan',
    detail:
      'Many campuses now discourage posting during the week. Decide in advance: most coaches say go quiet and stay present.',
    phase: 'social_media',
    monthsBeforeRush: 1,
  },

  // ---- wardrobe ----
  {
    id: 'outfits-by-round',
    title: 'Plan one outfit per round',
    detail:
      'Casual for Open House, elevated casual for Philanthropy/Sisterhood, dressy for Pref, letters-ready comfy for Bid Day. Check your campus dress guide first.',
    phase: 'wardrobe',
    monthsBeforeRush: 2,
    articleSlug: 'outfit-guide-by-round',
  },
  {
    id: 'break-in-shoes',
    title: 'Break in every pair of shoes',
    detail:
      'You will walk (and stand) for hours in August heat or January cold. Comfort beats couture — nobody bids your shoes.',
    phase: 'wardrobe',
    monthsBeforeRush: 1,
    articleSlug: 'outfit-guide-by-round',
  },

  // ---- week of ----
  {
    id: 'pack-rush-bag',
    title: 'Pack your rush bag',
    detail:
      'Portable charger, blister patches, deodorant, snacks, water, mini fan, safety pins, and a notes app for impressions between parties.',
    phase: 'week_of',
    monthsBeforeRush: 0,
    articleSlug: 'building-your-rush-bag',
  },
  {
    id: 'prep-elevator-pitch',
    title: 'Practice your intro & stories',
    detail:
      'Name, hometown, major, one thing you love. Then practice three go-to stories (an activity, a favorite class, a summer memory) out loud.',
    phase: 'week_of',
    monthsBeforeRush: 0,
    articleSlug: 'elevator-pitch',
  },
  {
    id: 'review-five-bs',
    title: 'Review the Five B\'s',
    detail:
      'Boys, Booze, Beliefs, Bucks, Ballots — the topics to steer around all week, for you and for the members talking to you.',
    phase: 'week_of',
    monthsBeforeRush: 0,
    articleSlug: 'five-bs',
  },
  {
    id: 'meet-rho-gamma',
    title: 'Meet your Rho Gamma & group',
    detail:
      'Save her number. She is your neutral guide, schedule-keeper, and shoulder for the week.',
    phase: 'week_of',
    monthsBeforeRush: 0,
    articleSlug: 'your-rho-gamma',
  },
  {
    id: 'plan-support-person',
    title: 'Pick your support person',
    detail:
      'One person (mom, friend, sibling) you can call after hard days. Agree they will listen, not catastrophize.',
    phase: 'week_of',
    monthsBeforeRush: 0,
    articleSlug: 'drop-resilience',
  },

  // ---- during rounds ----
  {
    id: 'log-impressions',
    title: 'Log impressions after every party',
    detail:
      'Two lines per chapter: how the conversation felt, one detail you remember. You will need this when ranking — houses blur together fast.',
    phase: 'during_rounds',
    monthsBeforeRush: 0,
    articleSlug: 'finding-your-fit',
  },
  {
    id: 'ask-real-questions',
    title: 'Ask questions that matter to you',
    detail:
      'Dues and payment plans, time commitment, live-in rules, academic support. You are choosing them too.',
    phase: 'during_rounds',
    monthsBeforeRush: 0,
    articleSlug: 'finding-your-fit',
  },
  {
    id: 'maximize-options',
    title: 'Maximize your options on your MRABA',
    detail:
      'Rank every chapter you attend at Pref (unless you would truly rather go home). Maximizing is the only strategy that guarantees a bid.',
    phase: 'during_rounds',
    monthsBeforeRush: 0,
    articleSlug: 'mraba-and-bid-matching',
  },

  // ---- bid day ----
  {
    id: 'bid-day-plan',
    title: 'Plan your Bid Day logistics',
    detail:
      'Know where to be and when, wear comfortable shoes you can run in, and charge your phone for photos.',
    phase: 'bid_day',
    monthsBeforeRush: 0,
    articleSlug: 'rush-101-how-rounds-work',
  },
  {
    id: 'know-fallbacks',
    title: 'Know your fallback options',
    detail:
      'If the week does not go your way: COB starts almost immediately, and spring/sophomore rush are real paths. This is a detour, not an ending.',
    phase: 'bid_day',
    monthsBeforeRush: 0,
    articleSlug: 'cob-explained',
  },
];
