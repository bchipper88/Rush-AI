import { z } from 'zod';

import { articles } from './articles';
import { checklistTemplates } from './checklistTemplates';
import { glossary } from './glossary';
import { defaultSchool, schools } from './schools';

const RegionSchema = z.enum(['south', 'southeast', 'texas', 'midwest', 'northeast', 'west']);
const StyleSchema = z.enum(['fall_formal', 'deferred_spring']);
const RecsSchema = z.enum(['required', 'recommended', 'not_used']);
const PrioritySchema = z.enum([
  'sisterhood',
  'philanthropy',
  'social',
  'academics',
  'leadership',
  'networking',
  'legacy',
]);
const PhaseSchema = z.enum([
  'register',
  'recs',
  'materials',
  'social_media',
  'wardrobe',
  'week_of',
  'during_rounds',
  'bid_day',
]);

const SchoolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  region: RegionSchema,
  style: StyleSchema,
  recs: RecsSchema,
  costTier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  chapterCount: z.number().int().positive(),
  rushMonth: z.number().int().min(1).max(12),
  registrationOpensMonthsBefore: z.number().int().min(0).max(12),
  notes: z.string().min(1),
});

const BlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), text: z.string().min(1) }),
  z.object({ type: z.literal('paragraph'), text: z.string().min(1) }),
  z.object({
    type: z.literal('list'),
    ordered: z.boolean().optional(),
    items: z.array(z.string().min(1)).min(1),
  }),
  z.object({
    type: z.literal('callout'),
    tone: z.enum(['tip', 'warning', 'info']),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('doDont'),
    dos: z.array(z.string().min(1)).min(1),
    donts: z.array(z.string().min(1)).min(1),
  }),
]);

const ArticleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  teaser: z.string().min(1),
  category: z.enum(['basics', 'strategy', 'recs', 'style', 'money', 'wellness']),
  readingMinutes: z.number().int().positive(),
  blocks: z.array(BlockSchema).min(1),
  relevantIf: z
    .object({
      recs: z.array(RecsSchema).optional(),
      style: z.array(StyleSchema).optional(),
      regions: z.array(RegionSchema).optional(),
    })
    .optional(),
});

const TemplateSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  detail: z.string().min(1),
  phase: PhaseSchema,
  monthsBeforeRush: z.number().int().min(0).max(12),
  articleSlug: z.string().optional(),
  appliesIf: z
    .object({
      recs: z.array(RecsSchema).optional(),
      style: z.array(StyleSchema).optional(),
      minCostTier: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
      priorities: z.array(PrioritySchema).optional(),
    })
    .optional(),
});

const GlossarySchema = z.object({
  term: z.string().min(1),
  aka: z.array(z.string().min(1)).optional(),
  definition: z.string().min(1),
});

describe('seed content', () => {
  it('schools all parse and have unique ids', () => {
    for (const school of [...schools, defaultSchool]) {
      expect(() => SchoolSchema.parse(school)).not.toThrow();
    }
    const ids = schools.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('deferred schools rush in winter/spring months, fall schools in fall', () => {
    for (const school of schools) {
      if (school.style === 'deferred_spring') {
        expect(school.rushMonth).toBeLessThanOrEqual(2);
      } else {
        expect(school.rushMonth).toBeGreaterThanOrEqual(8);
      }
    }
  });

  it('articles all parse and have unique slugs', () => {
    for (const article of articles) {
      expect(() => ArticleSchema.parse(article)).not.toThrow();
    }
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(articles.length).toBeGreaterThanOrEqual(15);
  });

  it('checklist templates all parse, have unique ids, and reference real articles', () => {
    const slugs = new Set(articles.map((a) => a.slug));
    for (const item of checklistTemplates) {
      expect(() => TemplateSchema.parse(item)).not.toThrow();
      if (item.articleSlug) {
        expect(slugs.has(item.articleSlug)).toBe(true);
      }
    }
    const ids = checklistTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('glossary terms all parse and are unique', () => {
    for (const term of glossary) {
      expect(() => GlossarySchema.parse(term)).not.toThrow();
    }
    const terms = glossary.map((t) => t.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
    expect(glossary.length).toBeGreaterThanOrEqual(18);
  });
});
