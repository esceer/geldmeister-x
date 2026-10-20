import { and, eq, isNull, notInArray } from 'drizzle-orm';

import { db } from '@/db/client';
import { expenses, expenseTags, type Expense } from '@/db/schema';
import { newId } from '@/lib/id';

export type ExpenseInput = {
  amount: number;
  currency: string;
  categoryId: string;
  tagIds: string[];
  date: string;
  description: string | null;
};

export function getExpense(id: string): (Expense & { tagIds: string[] }) | undefined {
  const expense = db.select().from(expenses).where(eq(expenses.id, id)).get();
  if (!expense) return undefined;
  const tagRows = db
    .select({ tagId: expenseTags.tagId })
    .from(expenseTags)
    .where(and(eq(expenseTags.expenseId, id), isNull(expenseTags.deletedAt)))
    .all();
  return { ...expense, tagIds: tagRows.map((r) => r.tagId) };
}

/** Creates the expense, or updates it when `id` is given (currency never changes on edit). */
export function saveExpense({ tagIds, currency, ...fields }: ExpenseInput, id?: string) {
  db.transaction((tx) => {
    const expenseId = id ?? newId();
    if (id) {
      tx.update(expenses).set(fields).where(eq(expenses.id, id)).run();
    } else {
      tx.insert(expenses)
        .values({ id: expenseId, currency, ...fields })
        .run();
    }

    // Tag links are soft-deleted too, so they can sync later.
    tx.update(expenseTags)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(expenseTags.expenseId, expenseId),
          isNull(expenseTags.deletedAt),
          notInArray(expenseTags.tagId, tagIds),
        ),
      )
      .run();
    for (const tagId of tagIds) {
      tx.insert(expenseTags)
        .values({ expenseId, tagId })
        .onConflictDoUpdate({
          target: [expenseTags.expenseId, expenseTags.tagId],
          set: { deletedAt: null },
        })
        .run();
    }
  });
}

export function deleteExpense(id: string) {
  db.update(expenses).set({ deletedAt: new Date() }).where(eq(expenses.id, id)).run();
}

export function restoreExpense(id: string) {
  db.update(expenses).set({ deletedAt: null }).where(eq(expenses.id, id)).run();
}
