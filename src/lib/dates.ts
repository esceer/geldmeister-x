import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { enGB, hu } from 'date-fns/locale';

// Expense dates are local calendar days stored as 'yyyy-MM-dd' keys.
export const toDateKey = (date: Date) => format(date, 'yyyy-MM-dd');
export const fromDateKey = (key: string) => parseISO(key);

export const dateLocale = (language: string) => (language === 'hu' ? hu : enGB);

export type RelativeDay = 'today' | 'yesterday' | null;

export function relativeDay(key: string): RelativeDay {
  const date = fromDateKey(key);
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';
  return null;
}

export function formatDate(date: Date, pattern: string, language: string) {
  return format(date, pattern, { locale: dateLocale(language) });
}
