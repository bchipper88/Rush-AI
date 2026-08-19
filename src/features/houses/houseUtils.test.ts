import {
  activeHouses,
  attendedRounds,
  emptyRoundLog,
  houseScore,
  houseSummaryForCoach,
  maximizeOptionsWarning,
  releasedHouses,
  roundProgress,
  suggestPrefRanking,
  TrackedHouse,
} from './houseUtils';

function house(
  id: string,
  overrides: Partial<TrackedHouse> = {},
): TrackedHouse {
  return {
    id,
    name: id,
    status: 'interested',
    rounds: {},
    ...overrides,
  };
}

describe('houseScore', () => {
  it('is 0 for an unrated house', () => {
    expect(houseScore(house('a'))).toBe(0);
    expect(houseScore(house('a', { rounds: { open_house: emptyRoundLog() } }))).toBe(0);
  });

  it('weights later rounds more heavily than earlier ones', () => {
    const earlyLove = house('early', {
      rounds: {
        open_house: { ...emptyRoundLog(), rating: 5 },
        preference: { ...emptyRoundLog(), rating: 2 },
      },
    });
    const lateLove = house('late', {
      rounds: {
        open_house: { ...emptyRoundLog(), rating: 2 },
        preference: { ...emptyRoundLog(), rating: 5 },
      },
    });
    // Same raw ratings, but Pref carries more weight
    expect(houseScore(lateLove)).toBeGreaterThan(houseScore(earlyLove));
  });

  it('ignores rounds she did not attend', () => {
    const h = house('a', {
      rounds: {
        open_house: { ...emptyRoundLog(), rating: 5 },
        philanthropy: { attended: false, rating: 1, vibes: [], notes: '' },
      },
    });
    expect(houseScore(h)).toBe(5);
  });
});

describe('suggestPrefRanking', () => {
  it('orders by weighted score, highest first', () => {
    const houses = [
      house('low', { rounds: { preference: { ...emptyRoundLog(), rating: 2 } } }),
      house('high', { rounds: { preference: { ...emptyRoundLog(), rating: 5 } } }),
      house('mid', { rounds: { preference: { ...emptyRoundLog(), rating: 4 } } }),
    ];
    expect(suggestPrefRanking(houses).map((h) => h.id)).toEqual(['high', 'mid', 'low']);
  });

  it('excludes released and withdrawn houses', () => {
    const houses = [
      house('kept', { rounds: { preference: { ...emptyRoundLog(), rating: 3 } } }),
      house('cut', { status: 'released' }),
      house('gone', { status: 'withdrew' }),
    ];
    expect(suggestPrefRanking(houses).map((h) => h.id)).toEqual(['kept']);
    expect(activeHouses(houses)).toHaveLength(1);
    expect(releasedHouses(houses)).toHaveLength(2);
  });

  it('breaks ties by how much she wrote', () => {
    const houses = [
      house('terse', {
        rounds: { preference: { ...emptyRoundLog(), rating: 4, notes: 'ok' } },
      }),
      house('wordy', {
        rounds: {
          preference: {
            ...emptyRoundLog(),
            rating: 4,
            notes: 'Loved every conversation and could see myself living here',
          },
        },
      }),
    ];
    expect(suggestPrefRanking(houses)[0].id).toBe('wordy');
  });
});

describe('maximizeOptionsWarning', () => {
  it('is clear when she lists everything she attended', () => {
    expect(maximizeOptionsWarning(2, 2).severity).toBe('none');
    expect(maximizeOptionsWarning(1, 1).severity).toBe('none');
  });

  it('flags danger on a single intentional preference', () => {
    const w = maximizeOptionsWarning(2, 1);
    expect(w.severity).toBe('danger');
    expect(w.message).toMatch(/does not improve your odds/i);
  });

  it('cautions when she drops some but not all', () => {
    const w = maximizeOptionsWarning(4, 2);
    expect(w.severity).toBe('caution');
    expect(w.message).toContain('4');
    expect(w.message).toContain('2');
  });
});

describe('progress helpers', () => {
  it('counts attended vs rated per round', () => {
    const houses = [
      house('a', { rounds: { open_house: { ...emptyRoundLog(), rating: 4 } } }),
      house('b', { rounds: { open_house: emptyRoundLog() } }),
    ];
    const open = roundProgress(houses).find((r) => r.round === 'open_house')!;
    expect(open.attended).toBe(2);
    expect(open.logged).toBe(1);
  });

  it('lists attended rounds in order', () => {
    const h = house('a', {
      rounds: { preference: emptyRoundLog(), open_house: emptyRoundLog() },
    });
    expect(attendedRounds(h)).toEqual(['open_house', 'preference']);
  });
});

describe('houseSummaryForCoach', () => {
  it('describes what is still in play', () => {
    const houses = [
      house('Chi Omega', {
        name: 'Chi Omega',
        rounds: { preference: { ...emptyRoundLog(), rating: 5 } },
      }),
      house('Phi Mu', { name: 'Phi Mu', status: 'released' }),
    ];
    const summary = houseSummaryForCoach(houses);
    expect(summary).toContain('Chi Omega');
    expect(summary).toContain('Released/withdrew: 1');
  });

  it('handles an empty roster', () => {
    expect(houseSummaryForCoach([])).toMatch(/no houses/i);
  });
});
