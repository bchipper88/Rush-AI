import type { AuditRequest, AuditResponse, AuditVerdict } from '../../../shared/audit';

const photoVerdicts: Omit<AuditVerdict, 'itemId'>[] = [
  {
    verdict: 'keep',
    flags: ['none'],
    reasons: [
      'Bright, natural photo with a genuine smile — exactly the vibe chapters look for.',
      'Clean background and outfit; nothing a recruitment committee could misread.',
    ],
    suggestion: 'Pin this one near the top of your grid.',
  },
  {
    verdict: 'edit',
    flags: ['low_quality'],
    reasons: [
      'Great moment, but the lighting is dim and the crop is tight.',
      'A brighter edit (or the original un-zoomed shot) would read much better in a fast scroll.',
    ],
    suggestion: 'Re-edit with more exposure, or swap in another photo from the same day.',
  },
  {
    verdict: 'archive',
    flags: ['alcohol_party'],
    reasons: [
      'The party setting (cups and crowd in the background) is the kind of context chapters screenshot during pre-screening.',
      'Even if nothing rule-breaking is happening, it invites the wrong questions.',
    ],
    suggestion: 'Archive until after Bid Day — you can always restore it later.',
  },
  {
    verdict: 'keep',
    flags: ['none'],
    reasons: [
      'Activity/interest photos like this give members an easy conversation starter.',
      'It shows personality beyond selfies — keep it visible.',
    ],
  },
  {
    verdict: 'delete',
    flags: ['revealing', 'alcohol_party'],
    reasons: [
      'This one combines a party context with an outfit that fails the "alumnae board" test.',
      'It is the single riskiest item in this set for pre-screening.',
    ],
    suggestion: 'Delete rather than archive — tagged copies may exist, so untag there too.',
  },
  {
    verdict: 'edit',
    flags: ['messy_grid'],
    reasons: [
      'The photo itself is fine but it clashes with the tone of the posts around it.',
      'Your grid reads more cohesive if travel/friend photos cluster together.',
    ],
    suggestion: 'Reorder or re-caption so the grid tells one warm, consistent story.',
  },
];

const captionVerdicts: Omit<AuditVerdict, 'itemId'>[] = [
  {
    verdict: 'edit',
    flags: ['negative_tone'],
    reasons: [
      'The sarcasm lands as negativity out of context — recruitment readers skim, they do not decode irony.',
      'A warmer rewrite keeps your voice without the edge.',
    ],
    suggestion: 'Try a version that is playful instead of biting.',
  },
  {
    verdict: 'keep',
    flags: ['none'],
    reasons: ['Warm, positive, and sounds like a real person — exactly right.'],
  },
  {
    verdict: 'delete',
    flags: ['profanity', 'five_bs'],
    reasons: [
      'Contains language and a topic (from the Five B\'s list) that chapters are explicitly trained to avoid.',
      'This is the kind of caption that gets screenshotted into a group chat.',
    ],
    suggestion: 'Remove it entirely; the photo can stay with a fresh caption.',
  },
];

/**
 * Deterministic demo results so the app works with no backend configured.
 * Cycles through curated verdicts by item index; same input → same output.
 */
export function mockAudit(request: AuditRequest): AuditResponse {
  const verdicts: AuditVerdict[] = request.items.map((item, i) => {
    const pool = item.kind === 'photo' ? photoVerdicts : captionVerdicts;
    const base = pool[i % pool.length];
    return { ...base, itemId: item.id };
  });

  const penalty = verdicts.reduce((acc, v) => {
    if (v.verdict === 'delete') return acc + 18;
    if (v.verdict === 'archive') return acc + 10;
    if (v.verdict === 'edit') return acc + 5;
    return acc;
  }, 0);
  const overallScore = Math.max(35, 95 - penalty);

  return {
    overallScore,
    summary:
      overallScore >= 75
        ? 'Your profile is in strong shape — a couple of tweaks and it is rush-ready. Chapters scrolling your page will meet a warm, genuine, put-together PNM.'
        : 'Good bones, but a few items would raise flags during chapter pre-screening. Handle the deletes and archives below first — they matter far more than any new post.',
    gridNotes:
      'Overall your grid skews warm and personal, which is exactly right. Aim for a mix of clear face shots, friends, and activities — and keep the first two rows the cleanest, since that is all most reviewers scroll.',
    cleanupActions: [
      'Archive or delete every flagged item below before registration closes.',
      'Check your tagged photos — the same standards apply there.',
      'Update your bio to school + year + something warm (drop any edgy quotes).',
      'Go quiet during rush week itself: most campuses now discourage posting.',
    ],
    verdicts,
  };
}
