import {
  addMonths,
  addQuarters,
  addWeeks,
  addYears,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from 'date-fns';

export type PeriodKind = 'week' | 'month' | 'quarter' | 'year';
export type Range = { from: Date; to: Date };

const weekOptions = { weekStartsOn: 1 } as const; // Monday

/** The calendar period of `kind` that contains `date`. */
export function periodRange(kind: PeriodKind, date: Date): Range {
  switch (kind) {
    case 'week':
      return { from: startOfWeek(date, weekOptions), to: endOfWeek(date, weekOptions) };
    case 'month':
      return { from: startOfMonth(date), to: endOfMonth(date) };
    case 'quarter':
      return { from: startOfQuarter(date), to: endOfQuarter(date) };
    case 'year':
      return { from: startOfYear(date), to: endOfYear(date) };
  }
}

/** Moves `date` by `amount` periods of `kind` (negative = back). */
export function shiftPeriod(kind: PeriodKind, date: Date, amount: number): Date {
  switch (kind) {
    case 'week':
      return addWeeks(date, amount);
    case 'month':
      return addMonths(date, amount);
    case 'quarter':
      return addQuarters(date, amount);
    case 'year':
      return addYears(date, amount);
  }
}

/** The `count` periods ending with the one containing `date`, oldest first. */
export function recentPeriods(kind: PeriodKind, date: Date, count: number): Range[] {
  return Array.from({ length: count }, (_, i) =>
    periodRange(kind, shiftPeriod(kind, date, i - count + 1)),
  );
}
