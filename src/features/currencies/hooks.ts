import { asc, eq, isNull, max } from 'drizzle-orm';

import { db } from '@/db/client';
import { currencies } from '@/db/schema';
import { useQuery } from '@/db/useQuery';
import { useSettings } from '@/features/settings/store';
import { newId } from '@/lib/id';

import { defaultDecimals } from './catalog';

export function getCurrency(code: string) {
  return db.select().from(currencies).where(eq(currencies.code, code)).get();
}

/** The active currency row (scopes every screen). */
export function useActiveCurrency() {
  const code = useSettings((s) => s.currency);
  return useQuery(() => getCurrency(code), ['currencies']);
}

export function useCurrencies() {
  return useQuery(
    () =>
      db
        .select()
        .from(currencies)
        .where(isNull(currencies.deletedAt))
        .orderBy(asc(currencies.sortOrder))
        .all(),
    ['currencies'],
  );
}

/** Hiding keeps the currency's data; tracking it again brings everything back. */
export function setTracked(code: string, tracked: boolean) {
  if (getCurrency(code)) {
    db.update(currencies)
      .set({ deletedAt: tracked ? null : new Date() })
      .where(eq(currencies.code, code))
      .run();
    return;
  }
  const last = db
    .select({ value: max(currencies.sortOrder) })
    .from(currencies)
    .get();
  db.insert(currencies)
    .values({
      id: newId(),
      code,
      decimals: defaultDecimals(code),
      sortOrder: (last?.value ?? -1) + 1,
    })
    .run();
}
