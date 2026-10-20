import type { TFunction } from 'i18next';

import { formatDate, fromDateKey, relativeDay } from '@/lib/dates';

/** "Today, 20 Oct" / "Mon, 19 Oct" (separator ', ' in the sheet, ' · ' in list headers). */
export function dayLabel(key: string, separator: string, t: TFunction, language: string) {
  const date = fromDateKey(key);
  const day = relativeDay(key);
  const weekdayOrRelative = day ? t(`common.${day}`) : formatDate(date, 'EEE', language);
  return weekdayOrRelative + separator + formatDate(date, t('dates.dayMonth'), language);
}
