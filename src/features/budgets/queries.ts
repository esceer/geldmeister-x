import { and, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { budgets } from '@/db/schema';
import { newId } from '@/lib/id';

const match = (categoryId: string, currency: string) =>
  and(eq(budgets.categoryId, categoryId), eq(budgets.currency, currency));

export function getBudget(categoryId: string, currency: string) {
  return db.select().from(budgets).where(match(categoryId, currency)).get();
}

/** Sets the monthly budget (one row per category and currency; revives a removed one). */
export function setBudget(categoryId: string, currency: string, amount: number) {
  db.insert(budgets)
    .values({ id: newId(), categoryId, currency, amount })
    .onConflictDoUpdate({
      target: [budgets.categoryId, budgets.currency],
      set: { amount, deletedAt: null },
    })
    .run();
}

export function removeBudget(categoryId: string, currency: string) {
  db.update(budgets).set({ deletedAt: new Date() }).where(match(categoryId, currency)).run();
}
