import { asc, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { categories, tags } from '@/db/schema';
import { useQuery } from '@/db/useQuery';
import { useSettings } from '@/features/settings/store';

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

/** The category preselected for new expenses: the chosen default, else the first one. */
export function useDefaultCategoryId() {
  const categories = useCategories();
  const chosen = useSettings((s) => s.defaultCategoryId);
  return categories.some((c) => c.id === chosen) ? chosen! : categories[0]?.id;
}

/** Active tags in user order (tags not yet reordered keep their creation order). */
export function useTags() {
  return useQuery(
    () =>
      db
        .select()
        .from(tags)
        .where(isNull(tags.deletedAt))
        .orderBy(asc(tags.sortOrder), asc(tags.createdAt))
        .all(),
    ['tags'],
  );
}
