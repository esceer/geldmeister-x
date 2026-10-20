import { asc, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/db/client';
import { categories, tags } from '@/db/schema';
import { newId } from '@/lib/id';

export function useCategories() {
  return useLiveQuery(
    db
      .select()
      .from(categories)
      .where(isNull(categories.deletedAt))
      .orderBy(asc(categories.sortOrder)),
  ).data;
}

export function useTags() {
  return useLiveQuery(
    db.select().from(tags).where(isNull(tags.deletedAt)).orderBy(asc(tags.createdAt)),
  ).data;
}

export function createTag(categoryId: string, name: string): string {
  const id = newId();
  db.insert(tags).values({ id, categoryId, name: name.trim() }).run();
  return id;
}
