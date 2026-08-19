import { z } from 'zod';

export const PracticeRoundSchema = z.enum([
  'open_house',
  'philanthropy',
  'sisterhood',
  'preference',
]);

export const PracticeMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().min(1).max(2000),
});

export const PracticeScoresSchema = z.object({
  warmth: z.number().min(0).max(10),
  curiosity: z.number().min(0).max(10),
  story: z.number().min(0).max(10),
  poise: z.number().min(0).max(10),
});

export const PracticeFeedbackSchema = z.object({
  overall: z.number().min(0).max(100),
  scores: PracticeScoresSchema,
  wins: z.array(z.string()).max(4),
  fixes: z.array(z.string()).max(4),
  fiveBsFlags: z.array(z.string()).max(5),
});

export const PracticeRequestSchema = z.object({
  round: PracticeRoundSchema,
  messages: z.array(PracticeMessageSchema).max(24),
  /** true = end the session and grade it instead of replying in character */
  finish: z.boolean(),
  context: z
    .object({
      name: z.string().optional(),
      schoolName: z.string().optional(),
      age: z.number().int().optional(),
    })
    .optional(),
});

export const PracticeResponseSchema = z.object({
  /** the chapter member's next line (absent when finishing) */
  reply: z.string().optional(),
  memberName: z.string().optional(),
  feedback: PracticeFeedbackSchema.optional(),
});

export type PracticeRound = z.infer<typeof PracticeRoundSchema>;
export type PracticeMessage = z.infer<typeof PracticeMessageSchema>;
export type PracticeFeedback = z.infer<typeof PracticeFeedbackSchema>;
export type PracticeRequest = z.infer<typeof PracticeRequestSchema>;
export type PracticeResponse = z.infer<typeof PracticeResponseSchema>;
