import type { ContentArticle, School } from '@/types';

/** True when an article is specifically relevant to the user's school. */
export function isRelevantForSchool(article: ContentArticle, school: School): boolean {
  const rel = article.relevantIf;
  if (!rel) return false;
  if (rel.recs && !rel.recs.includes(school.recs)) return false;
  if (rel.style && !rel.style.includes(school.style)) return false;
  if (rel.regions && !rel.regions.includes(school.region)) return false;
  return true;
}

/** Articles hidden entirely because they cannot apply (e.g. recs at a no-recs school). */
export function isApplicable(article: ContentArticle, school: School): boolean {
  const rel = article.relevantIf;
  if (!rel) return true;
  if (rel.recs && !rel.recs.includes(school.recs)) return false;
  if (rel.style && !rel.style.includes(school.style)) return false;
  return true;
}
