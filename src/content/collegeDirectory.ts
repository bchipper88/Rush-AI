import rawColleges from './usColleges.json';
import { schools } from './schools';

export interface DirectoryCollege {
  name: string;
  domain: string;
}

const curatedNames = new Set(schools.map((s) => s.name.toLowerCase()));
const curatedDomains = new Set(schools.map((s) => s.domain).filter(Boolean));

/** Full US college directory (~2,300 schools), minus ones already curated. */
export const collegeDirectory: DirectoryCollege[] = (
  rawColleges as DirectoryCollege[]
).filter(
  (c) => !curatedNames.has(c.name.toLowerCase()) && !curatedDomains.has(c.domain),
);

/** Case-insensitive substring search over the full directory. */
export function searchDirectory(query: string, limit = 30): DirectoryCollege[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const results: DirectoryCollege[] = [];
  for (const college of collegeDirectory) {
    if (college.name.toLowerCase().includes(q)) {
      results.push(college);
      if (results.length >= limit) break;
    }
  }
  return results;
}
