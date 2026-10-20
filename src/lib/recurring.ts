import { addDays, addMonths, addYears } from 'date-fns';

import { fromDateKey, toDateKey } from './dates';

export type Schedule = 'monthly' | 'yearly';

/**
 * The k-th occurrence (k = 0 is the start date). Counting from the start keeps the day stable:
 * a schedule starting on the 31st falls on Feb 28/29 and returns to Mar 31.
 */
export function occurrence(schedule: Schedule, startDate: string, k: number): string {
  const start = fromDateKey(startDate);
  return toDateKey(schedule === 'monthly' ? addMonths(start, k) : addYears(start, k));
}

/** First occurrence on or after `date`. */
export function firstOccurrenceFrom(schedule: Schedule, startDate: string, date: string): string {
  for (let k = 0; ; k++) {
    const due = occurrence(schedule, startDate, k);
    if (due >= date) return due;
  }
}

/**
 * Occurrences that are due (from `nextDue` up to and including `today`) and the next due date
 * after them. Date keys compare correctly as strings.
 */
export function catchUp(schedule: Schedule, startDate: string, nextDue: string, today: string) {
  const due: string[] = [];
  let next = firstOccurrenceFrom(schedule, startDate, nextDue);
  while (next <= today) {
    due.push(next);
    next = firstOccurrenceFrom(schedule, startDate, toDateKey(addDays(fromDateKey(next), 1)));
  }
  return { due, nextDue: next };
}
