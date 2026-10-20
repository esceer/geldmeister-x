import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/client';
import { currencies } from '@/db/schema';
import { useSettings } from '@/features/settings/store';

export function getCurrency(code: string) {
  return db.select().from(currencies).where(eq(currencies.code, code)).get();
}

/** The active currency row, or undefined while it loads. */
export function useActiveCurrency() {
  const code = useSettings((s) => s.currency);
  const { data } = useLiveQuery(db.select().from(currencies).where(eq(currencies.code, code)), [
    code,
  ]);
  return data[0];
}
