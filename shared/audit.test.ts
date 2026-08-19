import { AuditRequestSchema, AuditResponseSchema } from './audit';

describe('AuditRequestSchema', () => {
  const validItem = { id: 'p1', kind: 'photo' as const, base64: 'abc' };

  it('accepts a minimal valid request', () => {
    expect(AuditRequestSchema.safeParse({ items: [validItem] }).success).toBe(true);
  });

  it('rejects empty item lists', () => {
    expect(AuditRequestSchema.safeParse({ items: [] }).success).toBe(false);
  });

  it('accepts a full 12-photo grid plus bio and caption', () => {
    const items = Array.from({ length: 14 }, (_, i) => ({ ...validItem, id: `p${i}` }));
    expect(AuditRequestSchema.safeParse({ items }).success).toBe(true);
  });

  it('rejects more than 14 items', () => {
    const items = Array.from({ length: 15 }, (_, i) => ({ ...validItem, id: `p${i}` }));
    expect(AuditRequestSchema.safeParse({ items }).success).toBe(false);
  });

  it('rejects unknown kinds', () => {
    expect(
      AuditRequestSchema.safeParse({ items: [{ id: 'x', kind: 'video' }] }).success,
    ).toBe(false);
  });
});

describe('AuditResponseSchema', () => {
  const valid = {
    overallScore: 80,
    summary: 'Solid profile.',
    cleanupActions: ['Do a thing'],
    verdicts: [{ itemId: 'p1', verdict: 'keep', flags: ['none'], reasons: ['Fine'] }],
  };

  it('accepts a valid response', () => {
    expect(AuditResponseSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects out-of-range scores', () => {
    expect(AuditResponseSchema.safeParse({ ...valid, overallScore: 101 }).success).toBe(false);
    expect(AuditResponseSchema.safeParse({ ...valid, overallScore: -1 }).success).toBe(false);
  });

  it('rejects unknown verdicts and flags', () => {
    expect(
      AuditResponseSchema.safeParse({
        ...valid,
        verdicts: [{ itemId: 'p1', verdict: 'burn', flags: ['none'], reasons: [] }],
      }).success,
    ).toBe(false);
    expect(
      AuditResponseSchema.safeParse({
        ...valid,
        verdicts: [{ itemId: 'p1', verdict: 'keep', flags: ['vibes'], reasons: [] }],
      }).success,
    ).toBe(false);
  });
});
