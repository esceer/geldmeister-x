import { asc, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { categories, tags } from '@/db/schema';
import { useQuery } from '@/db/useQuery';

/** Active categories in user order; `includeArchived` for looking up names of past expenses. */
export function useCategories({ includeArchived = false } = {}) {
  return useQuery(
    () =>
      db
        .select()
        .from(categories)
        .where(includeArchived ? undefined : isNull(categories.deletedAt))
        .orderBy(asc(categories.sortOrder))
        .all(),
    ['categories'],
  );
}

export function useTags() {
  return useQuery(
    () => db.select().from(tags).where(isNull(tags.deletedAt)).orderBy(asc(tags.createdAt)).all(),
    ['tags'],
  );
}
