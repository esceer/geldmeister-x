import { asc, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { categories, tags } from '@/db/schema';
import { useQuery } from '@/db/useQuery';
import { newId } from '@/lib/id';

export function useCategories() {
  return useQuery(
    () =>
      db
        .select()
        .from(categories)
        .where(isNull(categories.deletedAt))
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

export function createTag(categoryId: string, name: string): string {
  const id = newId();
  db.insert(tags).values({ id, categoryId, name: name.trim() }).run();
  return id;
}
