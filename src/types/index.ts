export type Region =
  | 'south'
  | 'southeast'
  | 'texas'
  | 'midwest'
  | 'northeast'
  | 'west';

export type RecruitmentStyle = 'fall_formal' | 'deferred_spring';

export type RecsPolicy = 'required' | 'recommended' | 'not_used';

/** 1 = $, 2 = $$, 3 = $$$ */
export type CostTier = 1 | 2 | 3;

export interface School {
  id: string;
  name: string;
  shortName: string;
  /** .edu domain, used to render the school logo */
  domain?: string;
  region: Region;
  style: RecruitmentStyle;
  recs: RecsPolicy;
  costTier: CostTier;
  chapterCount: number;
  /** 1-12; anchor month for timeline math (Aug for SEC fall, Jan for deferred) */
  rushMonth: number;
  /** how many months before rush that registration typically opens */
  registrationOpensMonthsBefore: number;
  notes: string;
}

export type Priority =
  | 'sisterhood'
  | 'philanthropy'
  | 'social'
  | 'academics'
  | 'leadership'
  | 'networking'
  | 'legacy';

export interface UserProfile {
  name: string;
  schoolId: string | null;
  customSchoolName?: string;
  customSchoolDomain?: string;
  priorities: Priority[];
  /** calendar year of the recruitment the user is preparing for, e.g. 2027 */
  rushYear: number;
  gpa?: string;
  activities?: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export type Phase =
  | 'register'
  | 'recs'
  | 'materials'
  | 'social_media'
  | 'wardrobe'
  | 'week_of'
  | 'during_rounds'
  | 'bid_day';

export interface ChecklistConditions {
  recs?: RecsPolicy[];
  style?: RecruitmentStyle[];
  minCostTier?: CostTier;
  priorities?: Priority[];
}

export interface ChecklistTemplateItem {
  id: string;
  title: string;
  detail: string;
  phase: Phase;
  /** due-date offset in months before the rush anchor month; 0 = rush month */
  monthsBeforeRush: number;
  articleSlug?: string;
  /** every condition present must match for the item to be included */
  appliesIf?: ChecklistConditions;
}

export interface GeneratedChecklistItem extends ChecklistTemplateItem {
  dueLabel: string;
  dueDate: string;
}

export type ArticleCategory =
  | 'basics'
  | 'strategy'
  | 'recs'
  | 'style'
  | 'money'
  | 'wellness';

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; tone: 'tip' | 'warning' | 'info'; text: string }
  | { type: 'doDont'; dos: string[]; donts: string[] };

export interface ArticleRelevance {
  recs?: RecsPolicy[];
  style?: RecruitmentStyle[];
  regions?: Region[];
}

export interface ContentArticle {
  slug: string;
  title: string;
  teaser: string;
  category: ArticleCategory;
  readingMinutes: number;
  blocks: ArticleBlock[];
  relevantIf?: ArticleRelevance;
}

export interface GlossaryTerm {
  term: string;
  aka?: string[];
  definition: string;
}
