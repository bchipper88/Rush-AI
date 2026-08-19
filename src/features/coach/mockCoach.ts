import type { CoachChatRequest, CoachChatResponse } from '../../../shared/coach';

const DEFAULT_SUGGESTIONS = [
  'What should I work on next?',
  'Explain rec letters',
  'What do I wear to Pref?',
];

/**
 * Deterministic demo coach: rule-based answers grounded in the user's real
 * checklist so "what's next" is genuinely useful with no backend configured.
 */
export function mockCoachReply(request: CoachChatRequest): CoachChatResponse {
  const { context } = request;
  const lastUser =
    [...request.messages].reverse().find((m) => m.role === 'user')?.text.toLowerCase() ?? '';
  const undone = context.checklist.filter((i) => !i.done);

  if (/(next|first|start|priorit|to.?do|work on)/.test(lastUser)) {
    if (undone.length === 0) {
      return {
        reply: `Honestly, ${context.name}? You're done-done. Every item on your plan is checked off with ${context.daysUntilRush} days to spare. Spend the time you saved practicing conversations out loud and getting good sleep. 💪`,
        suggestions: ['How do I practice conversations?', 'What goes in my rush bag?', 'Tell me about Bid Day'],
      };
    }
    const top = undone.slice(0, 3);
    return {
      reply: `With ${context.daysUntilRush} days until rush at ${context.schoolName}, here's where I'd focus: ${top
        .map((i, n) => `${n + 1}) ${i.title} — ${i.dueLabel.toLowerCase()}`)
        .join('; ')}. Knock out the first one this week and check it off — momentum is everything.`,
      suggestions: ['Why do rec letters matter?', 'Help me plan outfits', 'How do I clean up my Instagram?'],
    };
  }

  if (/rec|letter|rif/.test(lastUser)) {
    return {
      reply: `Rec letters are alumnae vouching for you to their chapter — and in the ${context.region ?? 'South'}, chapters expect one per house. Start with family friends and your mom's network, then your local Alumnae Panhellenic association; send each writer your résumé, headshot, and transcript so it's effortless for them. The full playbook is in my "Rec Letters" guide in the library. 💌`,
      suggestions: ['Who can write my recs?', 'What goes in my social résumé?', 'What should I work on next?'],
    };
  }

  if (/wear|outfit|dress|clothes|shoe/.test(lastUser)) {
    return {
      reply: `Think escalation: casual and comfy for Open House, elevated casual for Philanthropy and Sisterhood, and your dressiest look for Pref. Two non-negotiables: check your campus dress guide first, and break in every pair of shoes — nobody has ever received a bid because of a designer label, but plenty of PNMs have suffered for cute shoes. My round-by-round outfit guide has budget tiers from $ to $$$. 👗`,
      suggestions: ['What is Pref like?', 'How much should I budget?', 'What should I work on next?'],
    };
  }

  if (/mraba|rank|suicide|bid match|maximize/.test(lastUser)) {
    return {
      reply: `After Pref you'll rank the chapters you visited on the MRABA — and the one piece of strategy that's actually math: rank every chapter you attended unless you'd truly rather go home. Listing only one house doesn't impress that house; it just deletes your safety net. Maximizing options is the only path that guarantees a bid.`,
      suggestions: ['What is RFM?', 'What if I get dropped?', 'What should I work on next?'],
    };
  }

  if (/cost|money|dues|budget|afford|expensive/.test(lastUser)) {
    return {
      reply: `Real talk: registration runs $165-$375, and new-member dues range from about $850 to $5,000 depending on campus. Ask every chapter for its dues sheet before Pref — it's a completely normal question — and have the family budget conversation now, not after you fall in love with a house. Living out or unhoused chapters cut costs a lot. 💵`,
      suggestions: ['Are payment plans a thing?', 'What should I work on next?', 'Explain rec letters'],
    };
  }

  if (/nervous|anxious|scared|worried|stress|dropped|cut|sad/.test(lastUser)) {
    return {
      reply: `Deep breath, ${context.name} — feeling this way is so normal that studies literally document it. Two things I want you to hold onto: almost every PNM gets released from houses she liked (it's capacity math, not a verdict on you), and the houses that invite you back chose you. Line up one support person to call after hard days, and remember COB and next year are real paths, not consolation prizes. 💗`,
      suggestions: ['What is COB?', 'How do drops actually work?', 'What should I work on next?'],
    };
  }

  return {
    reply: `Hey ${context.name}! I'm your rush coach — I know your ${context.schoolName} plan inside out (${context.checklist.filter((i) => i.done).length} of ${context.checklist.length} tasks done, ${context.daysUntilRush} days to go). Ask me anything: what to work on, rec letters, outfits, budgets, conversation strategy, or the emotional stuff. This is a no-judgment zone. 🎀`,
    suggestions: DEFAULT_SUGGESTIONS,
  };
}
