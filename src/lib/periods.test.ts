import { describe, expect, it } from '@jest/globals';

import { toDateKey } from './dates';
import { periodRange, recentPeriods, shiftPeriod, type Range } from './periods';

const keys = ({ from, to }: Range) => [toDateKey(from), toDateKey(to)];
const day = (key: string) => new Date(`${key}T12:00:00`);

describe('periodRange', () => {
  it('uses Monday–Sunday weeks', () => {
    expect(keys(periodRange('week', day('2026-10-21')))).toEqual(['2026-10-19', '2026-10-25']);
    expect(keys(periodRange('week', day('2026-10-19')))).toEqual(['2026-10-19', '2026-10-25']);
    expect(keys(periodRange('week', day('2026-10-25')))).toEqual(['2026-10-19', '2026-10-25']);
  });

  it('handles months, including February in a leap year', () => {
    expect(keys(periodRange('month', day('2026-10-21')))).toEqual(['2026-10-01', '2026-10-31']);
    expect(keys(periodRange('month', day('2028-02-10')))).toEqual(['2028-02-01', '2028-02-29']);
  });

  it('handles quarters and years', () => {
    expect(keys(periodRange('quarter', day('2026-10-21')))).toEqual(['2026-10-01', '2026-12-31']);
    expect(keys(periodRange('quarter', day('2026-02-01')))).toEqual(['2026-01-01', '2026-03-31']);
    expect(keys(periodRange('year', day('2026-10-21')))).toEqual(['2026-01-01', '2026-12-31']);
  });
});

describe('shiftPeriod', () => {
  it('clamps month ends instead of overflowing', () => {
    expect(toDateKey(shiftPeriod('month', day('2026-03-31'), -1))).toBe('2026-02-28');
  });

  it('crosses year boundaries', () => {
    expect(keys(periodRange('week', shiftPeriod('week', day('2026-01-01'), -1)))).toEqual([
      '2025-12-22',
      '2025-12-28',
    ]);
    expect(keys(periodRange('quarter', shiftPeriod('quarter', day('2026-01-15'), -1)))).toEqual([
      '2025-10-01',
      '2025-12-31',
    ]);
  });
});

describe('recentPeriods', () => {
  it('returns the last n periods, oldest first, ending with the current one', () => {
    expect(recentPeriods('month', day('2026-10-21'), 6).map((r) => toDateKey(r.from))).toEqual([
      '2026-05-01',
      '2026-06-01',
      '2026-07-01',
      '2026-08-01',
      '2026-09-01',
      '2026-10-01',
    ]);
  });
});
