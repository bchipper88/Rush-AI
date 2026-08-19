import { z } from 'zod';

export const RiskFlagSchema = z.enum([
  'alcohol_party',
  'revealing',
  'controversial',
  'profanity',
  'five_bs',
  'negative_tone',
  'messy_grid',
  'low_quality',
  'none',
]);

export const AuditItemInputSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['photo', 'caption', 'bio']),
  base64: z.string().optional(),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional(),
  text: z.string().optional(),
});

export const AuditRequestSchema = z.object({
  items: z.array(AuditItemInputSchema).min(1).max(10),
  context: z
    .object({
      schoolName: z.string().optional(),
      region: z.string().optional(),
    })
    .optional(),
});

export const AuditVerdictSchema = z.object({
  itemId: z.string(),
  verdict: z.enum(['keep', 'edit', 'archive', 'delete']),
  flags: z.array(RiskFlagSchema),
  reasons: z.array(z.string()),
  suggestion: z.string().optional(),
});

export const AuditResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  gridNotes: z.string().optional(),
  cleanupActions: z.array(z.string()),
  verdicts: z.array(AuditVerdictSchema),
});

export type RiskFlag = z.infer<typeof RiskFlagSchema>;
export type AuditItemInput = z.infer<typeof AuditItemInputSchema>;
export type AuditRequest = z.infer<typeof AuditRequestSchema>;
export type AuditVerdict = z.infer<typeof AuditVerdictSchema>;
export type AuditResponse = z.infer<typeof AuditResponseSchema>;
