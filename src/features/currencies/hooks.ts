import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { currencies } from '@/db/schema';
import { useQuery } from '@/db/useQuery';
import { useSettings } from '@/features/settings/store';

export function getCurrency(code: string) {
  return db.select().from(currencies).where(eq(currencies.code, code)).get();
}

/** The active currency row (scopes every screen). */
export function useActiveCurrency() {
  const code = useSettings((s) => s.currency);
  return useQuery(() => getCurrency(code), ['currencies']);
}
