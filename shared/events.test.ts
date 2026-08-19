import { EventsBatchSchema } from './events';

const validEvent = {
  installId: 'install_abc123def',
  name: 'audit_completed',
  ts: '2026-08-19T00:00:00.000Z',
  props: { score: 82, source: 'claude', gridMode: true },
};

describe('EventsBatchSchema', () => {
  it('accepts a valid batch', () => {
    expect(EventsBatchSchema.safeParse({ events: [validEvent] }).success).toBe(true);
  });

  it('rejects empty batches and >50 events', () => {
    expect(EventsBatchSchema.safeParse({ events: [] }).success).toBe(false);
    const events = Array.from({ length: 51 }, () => validEvent);
    expect(EventsBatchSchema.safeParse({ events }).success).toBe(false);
  });

  it('rejects nested objects in props', () => {
    expect(
      EventsBatchSchema.safeParse({
        events: [{ ...validEvent, props: { nested: { a: 1 } } }],
      }).success,
    ).toBe(false);
  });

  it('rejects a too-short installId', () => {
    expect(
      EventsBatchSchema.safeParse({ events: [{ ...validEvent, installId: 'x' }] }).success,
    ).toBe(false);
  });
});
