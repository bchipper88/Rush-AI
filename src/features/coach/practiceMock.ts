import type {
  PracticeFeedback,
  PracticeRequest,
  PracticeResponse,
  PracticeRound,
} from '../../../shared/practice';

const MEMBER_NAMES: Record<PracticeRound, string> = {
  open_house: 'Sadie',
  philanthropy: 'Maren',
  sisterhood: 'Presley',
  preference: 'Caroline',
};

/** Scripted member turns per round — she still gets a realistic volley offline. */
const SCRIPTS: Record<PracticeRound, string[]> = {
  open_house: [
    "Hi!! I'm Sadie — oh my gosh, I love your dress. What's your name and where are you from?",
    "No way, I have family there! What are you thinking about majoring in?",
    "That's so cool. What do you like to do when you're not in class?",
    "Okay I love that. Have you gotten to explore campus much yet?",
  ],
  philanthropy: [
    "Hey! I'm Maren. So our philanthropy is huge for us — we raise money for cystic fibrosis research. Is there a cause you've worked with before?",
    "I love that you've done that. What made you care about it?",
    "That's so genuine. How do you want to be involved in service in college?",
    "You'd fit right into our committee. What did you think of the video we showed?",
  ],
  sisterhood: [
    "Hi, I'm Presley! This round is my favorite because we actually get to talk. What's been the best part of your week so far?",
    "That's such a good answer. What are you looking for in a chapter, honestly?",
    "Yes — that matters so much. Who's been your biggest support through all this?",
    "I love that. Can you see yourself living in a house like this?",
  ],
  preference: [
    "Hi sweet girl, I'm Caroline. I asked to talk to you tonight. This chapter got me through my hardest semester — what has this year been like for you?",
    "Thank you for telling me that. What do you want your college experience to feel like?",
    "That's beautiful. What would having a place like this mean to you?",
  ],
};

const FIVE_BS: { flag: string; pattern: RegExp }[] = [
  { flag: 'Boys', pattern: /\b(boyfriend|hookup|frat guy|guys? i|dating|situationship)\b/i },
  { flag: 'Booze', pattern: /\b(drunk|drink|drinking|beer|vodka|wasted|party|shots?|fake id)\b/i },
  { flag: 'Bible', pattern: /\b(church|bible|jesus|god|religio|pray)\b/i },
  { flag: 'Bucks', pattern: /\b(money|rich|expensive|dues cost|afford|designer|my dad's)\b/i },
  { flag: 'Ballots', pattern: /\b(politic|vote|voting|election|republican|democrat|liberal|conservative)\b/i },
];

const FILLERS = /\b(um+|uh+|like i mean|idk|i dunno|whatever)\b/gi;

function clamp10(n: number): number {
  return Math.max(0, Math.min(10, Math.round(n)));
}

/** Heuristic grading so practice is genuinely useful with no backend. */
export function gradePractice(request: PracticeRequest): PracticeFeedback {
  const turns = request.messages.filter((m) => m.role === 'user');
  const text = turns.map((t) => t.text).join(' ');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const avgWords = turns.length ? words / turns.length : 0;

  const questionsAsked = turns.filter((t) => t.text.includes('?')).length;
  const fillerHits = (text.match(FILLERS) ?? []).length;
  const fiveBsFlags = FIVE_BS.filter((b) => b.pattern.test(text)).map((b) => b.flag);
  const exclamations = (text.match(/!/g) ?? []).length;
  const specifics = (text.match(/\b(because|when i|my favorite|last summer|i love|i got to)\b/gi) ?? [])
    .length;

  const warmth = clamp10(4 + exclamations * 0.8 + (avgWords > 6 ? 2 : 0) - fiveBsFlags.length);
  const curiosity = clamp10(2 + (turns.length ? (questionsAsked / turns.length) * 10 : 0));
  const story = clamp10(2 + specifics * 1.6 + (avgWords > 14 ? 2 : avgWords > 8 ? 1 : 0));
  const poise = clamp10(9 - fillerHits * 1.5 - (avgWords > 60 ? 3 : 0) - fiveBsFlags.length * 2);

  const overall = Math.max(
    0,
    Math.min(100, Math.round(((warmth + curiosity + story + poise) / 40) * 100)),
  );

  const wins: string[] = [];
  if (questionsAsked > 0) wins.push('You asked her questions back — that turns an interview into a conversation.');
  if (specifics > 0) wins.push('You gave specific details instead of one-word answers, which is what members remember.');
  if (exclamations > 0) wins.push('Your energy came through warm and genuine.');
  if (fiveBsFlags.length === 0 && turns.length > 0) wins.push("You steered clear of all Five B's.");

  const fixes: string[] = [];
  if (questionsAsked === 0 && turns.length > 0)
    fixes.push('Ask her something back — "what made you join this chapter?" works every time.');
  if (avgWords < 8 && turns.length > 0)
    fixes.push('Your answers ran short. Add one concrete detail so she has something to follow up on.');
  if (avgWords > 60) fixes.push('Tighten your answers — aim for a few sentences, then hand the conversation back.');
  if (fillerHits > 0) fixes.push('Watch the filler words ("um", "like I mean") — a breath beats a filler.');
  if (fiveBsFlags.length > 0)
    fixes.push(`You touched on ${fiveBsFlags.join(' and ')} — that's a Five B's topic. Redirect to campus life instead.`);
  if (turns.length === 0) fixes.push('You did not get a turn in — try the drill again and jump in!');

  return {
    overall,
    scores: { warmth, curiosity, story, poise },
    wins: wins.slice(0, 4),
    fixes: fixes.slice(0, 4),
    fiveBsFlags,
  };
}

/** Deterministic offline practice partner. */
export function mockPractice(request: PracticeRequest): PracticeResponse {
  if (request.finish) {
    return { feedback: gradePractice(request) };
  }
  const script = SCRIPTS[request.round];
  const turnIndex = request.messages.filter((m) => m.role === 'assistant').length;
  return {
    reply: script[Math.min(turnIndex, script.length - 1)],
    memberName: MEMBER_NAMES[request.round],
  };
}
