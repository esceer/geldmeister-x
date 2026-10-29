import { and, eq, isNull, max } from 'drizzle-orm';

import { db } from '@/db/client';
import { budgets, categories, recurring, tags } from '@/db/schema';
import { newId } from '@/lib/id';

export type CategoryInput = { name: string; icon: string; color: string };

export function getCategory(id: string) {
  return db.select().from(categories).where(eq(categories.id, id)).get();
}

export function createCategory(input: CategoryInput) {
  const last = db
    .select({ value: max(categories.sortOrder) })
    .from(categories)
    .where(isNull(categories.deletedAt))
    .get();
  db.insert(categories)
    .values({ id: newId(), ...input, sortOrder: (last?.value ?? -1) + 1 })
    .run();
}

export function updateCategory(id: string, input: CategoryInput) {
  db.update(categories).set(input).where(eq(categories.id, id)).run();
}

/**
 * Archives a category: it leaves pickers and management, its budgets and recurring items stop,
 * but past expenses keep it so lists and reports stay accurate.
 */
export function archiveCategory(id: string) {
  const now = new Date();
  db.transaction((tx) => {
    tx.update(categories).set({ deletedAt: now }).where(eq(categories.id, id)).run();
    tx.update(budgets)
      .set({ deletedAt: now })
      .where(and(eq(budgets.categoryId, id), isNull(budgets.deletedAt)))
      .run();
    tx.update(recurring)
      .set({ deletedAt: now })
      .where(and(eq(recurring.categoryId, id), isNull(recurring.deletedAt)))
      .run();
  });
}

export function reorderCategories(orderedIds: string[]) {
  db.transaction((tx) => {
    orderedIds.forEach((id, index) => {
      tx.update(categories).set({ sortOrder: index }).where(eq(categories.id, id)).run();
    });
  });
}

export function createTag(categoryId: string, name: string): string {
  const id = newId();
  const last = db
    .select({ value: max(tags.sortOrder) })
    .from(tags)
    .where(and(eq(tags.categoryId, categoryId), isNull(tags.deletedAt)))
    .get();
  db.insert(tags)
    .values({ id, categoryId, name: name.trim(), sortOrder: (last?.value ?? -1) + 1 })
    .run();
  return id;
}

export function reorderTags(orderedIds: string[]) {
  db.transaction((tx) => {
    orderedIds.forEach((id, index) => {
      tx.update(tags).set({ sortOrder: index }).where(eq(tags.id, id)).run();
    });
  });
}

export function getTag(id: string) {
  return db.select().from(tags).where(eq(tags.id, id)).get();
}

export function renameTag(id: string, name: string) {
  db.update(tags).set({ name: name.trim() }).where(eq(tags.id, id)).run();
}

/** Soft delete: the tag leaves pickers but stays on past expenses and in reports. */
export function deleteTag(id: string) {
  db.update(tags).set({ deletedAt: new Date() }).where(eq(tags.id, id)).run();
}

export function restoreTag(id: string) {
  db.update(tags).set({ deletedAt: null }).where(eq(tags.id, id)).run();
}
