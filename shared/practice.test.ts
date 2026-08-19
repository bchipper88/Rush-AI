import { PracticeRequestSchema, PracticeResponseSchema } from './practice';

const base = {
  round: 'open_house' as const,
  messages: [{ role: 'user' as const, text: 'Hi!' }],
  finish: false,
};

describe('PracticeRequestSchema', () => {
  it('accepts a valid turn request', () => {
    expect(PracticeRequestSchema.safeParse(base).success).toBe(true);
  });

  it('accepts an empty conversation (the member opens)', () => {
    expect(PracticeRequestSchema.safeParse({ ...base, messages: [] }).success).toBe(true);
  });

  it('rejects unknown rounds', () => {
    expect(PracticeRequestSchema.safeParse({ ...base, round: 'bid_day' }).success).toBe(false);
  });

  it('caps conversation length', () => {
    const messages = Array.from({ length: 25 }, () => ({ role: 'user' as const, text: 'hi' }));
    expect(PracticeRequestSchema.safeParse({ ...base, messages }).success).toBe(false);
  });

  it('requires the finish flag', () => {
    const { finish: _finish, ...withoutFinish } = base;
    expect(PracticeRequestSchema.safeParse(withoutFinish).success).toBe(false);
  });
});

describe('PracticeResponseSchema', () => {
  it('accepts an in-character reply', () => {
    expect(
      PracticeResponseSchema.safeParse({ reply: 'Hi, I am Sadie!', memberName: 'Sadie' }).success,
    ).toBe(true);
  });

  it('accepts structured feedback', () => {
    expect(
      PracticeResponseSchema.safeParse({
        feedback: {
          overall: 82,
          scores: { warmth: 8, curiosity: 7, story: 9, poise: 8 },
          wins: ['Asked great questions'],
          fixes: ['Add a detail'],
          fiveBsFlags: [],
        },
      }).success,
    ).toBe(true);
  });

  it('rejects out-of-range scores', () => {
    expect(
      PracticeResponseSchema.safeParse({
        feedback: {
          overall: 120,
          scores: { warmth: 8, curiosity: 7, story: 9, poise: 8 },
          wins: [],
          fixes: [],
          fiveBsFlags: [],
        },
      }).success,
    ).toBe(false);

    expect(
      PracticeResponseSchema.safeParse({
        feedback: {
          overall: 50,
          scores: { warmth: 11, curiosity: 7, story: 9, poise: 8 },
          wins: [],
          fixes: [],
          fiveBsFlags: [],
        },
      }).success,
    ).toBe(false);
  });
});
