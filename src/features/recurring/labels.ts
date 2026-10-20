import { differenceInCalendarDays } from 'date-fns';
import type { TFunction } from 'i18next';

import { formatDate, fromDateKey } from '@/lib/dates';
import type { Schedule } from '@/lib/recurring';

/** "Monthly on the 22nd" / "Yearly on 1 Jan". */
export function scheduleLabel(
  schedule: Schedule,
  startDate: string,
  t: TFunction,
  language: string,
) {
  const start = fromDateKey(startDate);
  return schedule === 'monthly'
    ? t('recurring.monthlyOn', { day: formatDate(start, 'do', language) })
    : t('recurring.yearlyOn', { date: formatDate(start, t('dates.dayMonth'), language) });
}

/** "Today", "Tomorrow", "in 5 days", or the date for later occurrences. */
export function dueLabel(nextDue: string, t: TFunction, language: string, today = new Date()) {
  const due = fromDateKey(nextDue);
  const days = differenceInCalendarDays(due, today);
  if (days <= 0) return t('common.today');
  if (days === 1) return t('recurring.tomorrow');
  if (days <= 7) return t('recurring.inDays', { count: days });
  const sameYear = due.getFullYear() === today.getFullYear();
  return formatDate(due, t(sameYear ? 'dates.dayMonth' : 'dates.dayMonthYear'), language);
}
