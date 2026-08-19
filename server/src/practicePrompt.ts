import type Anthropic from '@anthropic-ai/sdk';

import type { PracticeRequest, PracticeRound } from '../../shared/practice.ts';

const ROUND_BRIEF: Record<PracticeRound, string> = {
  open_house:
    'Open House: the shortest, highest-energy party. You have ~4 minutes, the room is loud, and you are meeting dozens of PNMs. Keep questions light and fast — name, hometown, major, what she is excited about.',
  philanthropy:
    'Philanthropy round: you are presenting your chapter\'s national cause and often doing a craft or activity. Talk about why the cause matters to you personally and ask what she cares about.',
  sisterhood:
    'Sisterhood round: longer and more relaxed, often with a house tour. Go deeper — favorite memories, what living here is like, what she is looking for in a chapter.',
  preference:
    'Preference round: the most emotional and intimate round. Quieter, sincere, sometimes teary. Talk about what the chapter has meant to you and ask what she wants from her college experience.',
};

export function buildPracticeSystemPrompt(request: PracticeRequest): string {
  const age = request.context?.age;
  const ageLine =
    age && age < 18
      ? 'The PNM is under 18 — keep everything strictly age-appropriate and encouraging.'
      : '';

  if (request.finish) {
    return `You are a sorority recruitment coach grading a practice conversation. The PNM was talking with a chapter member during the ${ROUND_BRIEF[request.round]}

Grade her side of the conversation only. Score each dimension 0-10:
- warmth: did she come across friendly, genuine, and easy to talk to?
- curiosity: did she ask the member questions back, and follow up on answers?
- story: did she offer specific, memorable details instead of one-word answers?
- poise: did she stay composed, avoid rambling, and handle the conversation confidently?

overall is 0-100 and should reflect the whole showing, not a simple average.
wins: up to 4 short, specific things she did well (quote or reference what she actually said).
fixes: up to 4 short, concrete improvements — actionable, never vague.
fiveBsFlags: list any of the Five B's she raised (Boys, Booze, Beliefs/religion of any faith, Bucks/money, Ballots/politics). Empty array if none.

Tone: warm big-sister coach. Encouraging and honest. Never mention chapter tiers or guarantee outcomes. ${ageLine}`;
  }

  return `You are role-playing a friendly, genuine sorority chapter member talking with a PNM during recruitment. Stay fully in character — never break the fourth wall, never coach her mid-conversation, never mention that this is practice.

Round context: ${ROUND_BRIEF[request.round]}

How to play it:
- Speak like a real 20-year-old: warm, natural, a little enthusiastic. Contractions, not formal prose.
- Keep each turn SHORT — 1-3 sentences, usually ending in a question. Real recruitment conversations are fast volleys, not monologues.
- Introduce yourself with a first name on your first turn and stay consistent.
- React to what she actually says; follow up on her specifics rather than running a script.
- Stay away from the Five B's yourself (boys, booze, religion, money, politics) — a real member is trained to.
- Never promise a bid, rank chapters, or discuss other houses.

Return your line in "reply" and your character's first name in "memberName". ${ageLine}`;
}

export function buildPracticeMessages(request: PracticeRequest): Anthropic.MessageParam[] {
  const history = request.messages.map(
    (m): Anthropic.MessageParam => ({ role: m.role, content: m.text }),
  );

  if (request.finish) {
    const transcript = request.messages
      .map((m) => `${m.role === 'user' ? 'PNM' : 'Member'}: ${m.text}`)
      .join('\n');
    return [
      {
        role: 'user',
        content: `Here is the full practice conversation. Grade the PNM's side.\n\n${transcript || '(no conversation took place)'}`,
      },
    ];
  }

  // Kick off the party if she hasn't spoken yet
  if (history.length === 0) {
    return [
      {
        role: 'user',
        content:
          '(The PNM just walked up to you at the party. Greet her and start the conversation.)',
      },
    ];
  }
  return history;
}
