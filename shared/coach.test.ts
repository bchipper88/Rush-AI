import { CoachChatRequestSchema, CoachChatResponseSchema } from './coach';

const context = {
  name: 'Emma',
  schoolName: 'University of Alabama',
  region: 'south',
  season: 'fall' as const,
  rushYear: 2027,
  daysUntilRush: 120,
  priorities: ['sisterhood'],
  checklist: [
    { title: 'Register', phase: 'register', dueLabel: 'By May 2027', done: false },
  ],
};

describe('CoachChatRequestSchema', () => {
  it('accepts a valid request', () => {
    const parsed = CoachChatRequestSchema.safeParse({
      messages: [{ role: 'user', text: 'What next?' }],
      context,
    });
    expect(parsed.success).toBe(true);
  });

  it('requires at least one message', () => {
    expect(CoachChatRequestSchema.safeParse({ messages: [], context }).success).toBe(false);
  });

  it('rejects more than 30 messages', () => {
    const messages = Array.from({ length: 31 }, () => ({ role: 'user' as const, text: 'hi' }));
    expect(CoachChatRequestSchema.safeParse({ messages, context }).success).toBe(false);
  });

  it('rejects unknown roles and empty text', () => {
    expect(
      CoachChatRequestSchema.safeParse({
        messages: [{ role: 'system', text: 'hi' }],
        context,
      }).success,
    ).toBe(false);
    expect(
      CoachChatRequestSchema.safeParse({
        messages: [{ role: 'user', text: '' }],
        context,
      }).success,
    ).toBe(false);
  });
});

describe('CoachChatResponseSchema', () => {
  it('accepts a valid response', () => {
    expect(
      CoachChatResponseSchema.safeParse({ reply: 'Do the thing!', suggestions: ['Next?'] })
        .success,
    ).toBe(true);
  });

  it('rejects an empty reply and >3 suggestions', () => {
    expect(
      CoachChatResponseSchema.safeParse({ reply: '', suggestions: [] }).success,
    ).toBe(false);
    expect(
      CoachChatResponseSchema.safeParse({
        reply: 'ok',
        suggestions: ['a', 'b', 'c', 'd'],
      }).success,
    ).toBe(false);
  });
});
