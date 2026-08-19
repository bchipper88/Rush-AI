import {
  ageBracket,
  ageFromBirthDate,
  canUseAiChat,
  meetsMinimumAge,
  profileAge,
} from './age';

const NOW = new Date(2026, 7, 19); // Aug 19, 2026

describe('ageFromBirthDate', () => {
  it('computes whole years', () => {
    expect(ageFromBirthDate('2008-08-19', NOW)).toBe(18);
    expect(ageFromBirthDate('2008-08-20', NOW)).toBe(17); // birthday tomorrow
    expect(ageFromBirthDate('2008-08-18', NOW)).toBe(18); // birthday yesterday
  });

  it('handles a leap-day birthday', () => {
    expect(ageFromBirthDate('2008-02-29', NOW)).toBe(18);
    expect(ageFromBirthDate('2008-02-29', new Date(2026, 1, 28))).toBe(17);
  });

  it('returns null for malformed input', () => {
    expect(ageFromBirthDate('', NOW)).toBeNull();
    expect(ageFromBirthDate('not-a-date', NOW)).toBeNull();
  });
});

describe('ageBracket', () => {
  it('maps ages to coarse brackets', () => {
    expect(ageBracket(17)).toBe('under_18');
    expect(ageBracket(18)).toBe('18_19');
    expect(ageBracket(19)).toBe('18_19');
    expect(ageBracket(20)).toBe('20_21');
    expect(ageBracket(21)).toBe('20_21');
    expect(ageBracket(22)).toBe('22_plus');
    expect(ageBracket(45)).toBe('22_plus');
  });
});

describe('profileAge', () => {
  it('returns null when no birth date is stored', () => {
    expect(profileAge(null, NOW)).toBeNull();
    expect(profileAge({}, NOW)).toBeNull();
  });
});

describe('age gating', () => {
  it('treats an unknown age as meeting the minimum (legacy users)', () => {
    expect(meetsMinimumAge(null, NOW)).toBe(true);
    expect(meetsMinimumAge({}, NOW)).toBe(true);
  });

  it('recognizes under-minimum users', () => {
    expect(meetsMinimumAge({ birthDate: '2010-01-01' }, NOW)).toBe(false);
    expect(meetsMinimumAge({ birthDate: '2005-01-01' }, NOW)).toBe(true);
  });

  it('allows AI chat under the current soft policy regardless of age', () => {
    // AGE_ENFORCEMENT is 'soft' — flipping it to 'hard' makes this false for minors
    expect(canUseAiChat({ birthDate: '2010-01-01' }, NOW)).toBe(true);
    expect(canUseAiChat({ birthDate: '2000-01-01' }, NOW)).toBe(true);
  });
});
