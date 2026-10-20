import { describe, expect, it } from '@jest/globals';

import { catchUp, firstOccurrenceFrom, occurrence } from './recurring';

describe('occurrence', () => {
  it('keeps the day of month, clamping short months without drifting', () => {
    expect(occurrence('monthly', '2026-01-31', 1)).toBe('2026-02-28');
    expect(occurrence('monthly', '2026-01-31', 2)).toBe('2026-03-31');
    expect(occurrence('monthly', '2028-01-31', 1)).toBe('2028-02-29');
  });

  it('handles yearly schedules on leap days', () => {
    expect(occurrence('yearly', '2028-02-29', 1)).toBe('2029-02-28');
    expect(occurrence('yearly', '2028-02-29', 4)).toBe('2032-02-29');
  });
});

describe('firstOccurrenceFrom', () => {
  it('returns the date itself when it is an occurrence', () => {
    expect(firstOccurrenceFrom('monthly', '2026-01-22', '2026-10-22')).toBe('2026-10-22');
  });

  it('returns the next occurrence otherwise', () => {
    expect(firstOccurrenceFrom('monthly', '2026-01-22', '2026-10-23')).toBe('2026-11-22');
    expect(firstOccurrenceFrom('yearly', '2026-01-01', '2026-10-21')).toBe('2027-01-01');
  });

  it('returns the start date when it is in the future', () => {
    expect(firstOccurrenceFrom('monthly', '2026-12-05', '2026-10-21')).toBe('2026-12-05');
  });
});

describe('catchUp', () => {
  it('returns nothing when the next occurrence is in the future', () => {
    expect(catchUp('monthly', '2026-01-22', '2026-10-22', '2026-10-21')).toEqual({
      due: [],
      nextDue: '2026-10-22',
    });
  });

  it('includes an occurrence due today and moves past it', () => {
    expect(catchUp('monthly', '2026-01-22', '2026-10-22', '2026-10-22')).toEqual({
      due: ['2026-10-22'],
      nextDue: '2026-11-22',
    });
  });

  it('catches up every missed occurrence after a long pause', () => {
    expect(catchUp('monthly', '2026-01-31', '2026-01-31', '2026-04-15')).toEqual({
      due: ['2026-01-31', '2026-02-28', '2026-03-31'],
      nextDue: '2026-04-30',
    });
  });

  it('catches up yearly schedules', () => {
    expect(catchUp('yearly', '2025-01-01', '2026-01-01', '2026-10-21')).toEqual({
      due: ['2026-01-01'],
      nextDue: '2027-01-01',
    });
  });
});
