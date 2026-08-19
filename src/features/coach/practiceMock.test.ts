import type { PracticeMessage, PracticeRequest } from '../../../shared/practice';
import { gradePractice, mockPractice } from './practiceMock';

function req(messages: PracticeMessage[], finish = false): PracticeRequest {
  return { round: 'open_house', messages, finish };
}

const strongAnswer =
  "I'm Emma from Nashville! I'm so excited because I love that your chapter does so much service — " +
  'my favorite thing last summer was coaching a little kids soccer camp. What made you join?';

describe('mockPractice', () => {
  it('opens the conversation in character before she speaks', () => {
    const res = mockPractice(req([]));
    expect(res.reply).toBeTruthy();
    expect(res.memberName).toBe('Sadie');
    expect(res.feedback).toBeUndefined();
  });

  it('advances through the script as the conversation goes', () => {
    const first = mockPractice(req([]));
    const second = mockPractice(
      req([
        { role: 'assistant', text: first.reply! },
        { role: 'user', text: 'Hi! I am Emma.' },
      ]),
    );
    expect(second.reply).not.toBe(first.reply);
  });

  it('returns feedback instead of a reply when finishing', () => {
    const res = mockPractice(req([{ role: 'user', text: strongAnswer }], true));
    expect(res.reply).toBeUndefined();
    expect(res.feedback).toBeDefined();
  });

  it('is deterministic', () => {
    expect(mockPractice(req([]))).toEqual(mockPractice(req([])));
  });
});

describe('gradePractice', () => {
  it('keeps every score within bounds', () => {
    const f = gradePractice(req([{ role: 'user', text: strongAnswer }], true));
    expect(f.overall).toBeGreaterThanOrEqual(0);
    expect(f.overall).toBeLessThanOrEqual(100);
    for (const v of Object.values(f.scores)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it('rewards asking questions back', () => {
    const withQuestion = gradePractice(
      req([{ role: 'user', text: 'I love it here! What made you join?' }], true),
    );
    const without = gradePractice(
      req([{ role: 'user', text: 'I love it here.' }], true),
    );
    expect(withQuestion.scores.curiosity).toBeGreaterThan(without.scores.curiosity);
  });

  it("detects each of the Five B's", () => {
    expect(
      gradePractice(req([{ role: 'user', text: 'my boyfriend goes here' }], true)).fiveBsFlags,
    ).toContain('Boys');
    expect(
      gradePractice(req([{ role: 'user', text: 'we got so drunk last night' }], true))
        .fiveBsFlags,
    ).toContain('Booze');
    expect(
      gradePractice(req([{ role: 'user', text: 'I go to church every Sunday' }], true))
        .fiveBsFlags,
    ).toContain('Beliefs');
    expect(
      gradePractice(req([{ role: 'user', text: 'my dad said money is no issue' }], true))
        .fiveBsFlags,
    ).toContain('Bucks');
    expect(
      gradePractice(req([{ role: 'user', text: 'the election was wild' }], true)).fiveBsFlags,
    ).toContain('Ballots');
  });

  it('catches faith of any tradition, not just Christian phrasing', () => {
    for (const line of [
      'I go to synagogue every Friday',
      'my mosque back home is amazing',
      'we read Torah together',
      'my youth group did a missions trip',
      'faith is a big part of my life',
    ]) {
      expect(gradePractice(req([{ role: 'user', text: line }], true)).fiveBsFlags).toContain(
        'Beliefs',
      );
    }
  });

  it('flags a Five B in the fixes list and penalizes poise', () => {
    const clean = gradePractice(req([{ role: 'user', text: 'I love my classes here!' }], true));
    const flagged = gradePractice(
      req([{ role: 'user', text: 'I love my classes and getting drunk here!' }], true),
    );
    expect(flagged.scores.poise).toBeLessThan(clean.scores.poise);
    expect(flagged.fixes.join(' ')).toMatch(/Five B/i);
  });

  it('tells her to jump in when she never spoke', () => {
    const f = gradePractice(req([{ role: 'assistant', text: 'Hi!' }], true));
    expect(f.fixes.join(' ')).toMatch(/did not get a turn/i);
  });

  it('penalizes filler words', () => {
    const clean = gradePractice(req([{ role: 'user', text: 'I am so excited to be here' }], true));
    const filler = gradePractice(
      req([{ role: 'user', text: 'um I am like i mean idk excited' }], true),
    );
    expect(filler.scores.poise).toBeLessThan(clean.scores.poise);
  });
});
