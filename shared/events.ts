import { z } from 'zod';

export const EventPropsSchema = z.record(
  z.string().max(64),
  z.union([z.string().max(300), z.number(), z.boolean(), z.null()]),
);

export const AnalyticsEventSchema = z.object({
  /** anonymous per-install id — no account, no PII */
  installId: z.string().min(8).max(64),
  name: z.string().min(1).max(64),
  ts: z.string(),
  props: EventPropsSchema.optional(),
});

export const EventsBatchSchema = z.object({
  events: z.array(AnalyticsEventSchema).min(1).max(50),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;
export type EventsBatch = z.infer<typeof EventsBatchSchema>;
