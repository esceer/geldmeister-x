import type { TFunction } from 'i18next';

import { formatDate } from '@/lib/dates';
import type { Range } from '@/lib/periods';

/** "1 – 31 October 2026", "28 Sep – 4 Oct 2026", … with per-language patterns. */
export function formatRange({ from, to }: Range, t: TFunction, language: string) {
  const kind =
    from.getFullYear() !== to.getFullYear()
      ? 'otherYear'
      : from.getMonth() !== to.getMonth()
        ? 'sameYear'
        : 'sameMonth';
  return `${formatDate(from, t(`dates.range.${kind}.from`), language)} – ${formatDate(to, t(`dates.range.${kind}.to`), language)}`;
}
