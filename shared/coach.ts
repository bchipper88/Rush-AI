import { z } from 'zod';

export const CoachMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  text: z.string().min(1).max(4000),
});

export const CoachChecklistItemSchema = z.object({
  title: z.string(),
  phase: z.string(),
  dueLabel: z.string(),
  done: z.boolean(),
});

export const CoachContextSchema = z.object({
  name: z.string(),
  schoolName: z.string(),
  region: z.string().optional(),
  season: z.enum(['fall', 'spring']),
  rushYear: z.number().int(),
  targetDate: z.string().optional(),
  daysUntilRush: z.number().int(),
  priorities: z.array(z.string()),
  gpa: z.string().optional(),
  checklist: z.array(CoachChecklistItemSchema).max(60),
  houses: z.string().max(1200).optional(),
});

export const CoachChatRequestSchema = z.object({
  messages: z.array(CoachMessageSchema).min(1).max(30),
  context: CoachContextSchema,
});

export const CoachChatResponseSchema = z.object({
  reply: z.string().min(1),
  suggestions: z.array(z.string().max(80)).max(3),
});

export type CoachMessage = z.infer<typeof CoachMessageSchema>;
export type CoachContext = z.infer<typeof CoachContextSchema>;
export type CoachChatRequest = z.infer<typeof CoachChatRequestSchema>;
export type CoachChatResponse = z.infer<typeof CoachChatResponseSchema>;
