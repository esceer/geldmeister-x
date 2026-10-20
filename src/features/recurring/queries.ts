import { eq, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { recurring } from '@/db/schema';
import { writeExpense } from '@/features/expenses/queries';
import { toDateKey } from '@/lib/dates';
import { newId } from '@/lib/id';
import { catchUp, firstOccurrenceFrom, type Schedule } from '@/lib/recurring';

export type RecurringInput = {
  amount: number;
  currency: string;
  categoryId: string;
  tagIds: string[];
  description: string | null;
  schedule: Schedule;
  startDate: string;
};

export function getRecurring(id: string) {
  return db.select().from(recurring).where(eq(recurring.id, id)).get();
}

/** Edits apply to future occurrences only; already generated expenses stay as they are. */
export function saveRecurring(input: RecurringInput, id?: string) {
  const existing = id ? getRecurring(id) : undefined;
  const nextDue = existing
    ? firstOccurrenceFrom(input.schedule, input.startDate, existing.nextDue)
    : input.startDate;

  if (id)
    db.update(recurring)
      .set({ ...input, nextDue })
      .where(eq(recurring.id, id))
      .run();
  else
    db.insert(recurring)
      .values({ id: newId(), ...input, nextDue })
      .run();

  generateDueExpenses();
}

export function deleteRecurring(id: string) {
  db.update(recurring).set({ deletedAt: new Date() }).where(eq(recurring.id, id)).run();
}

export function restoreRecurring(id: string) {
  db.update(recurring).set({ deletedAt: null }).where(eq(recurring.id, id)).run();
}

/** Adds every occurrence due up to today (catching up missed ones) as a normal expense. */
export function generateDueExpenses(today = toDateKey(new Date())) {
  db.transaction((tx) => {
    const items = tx.select().from(recurring).where(isNull(recurring.deletedAt)).all();
    for (const item of items) {
      const { due, nextDue } = catchUp(item.schedule, item.startDate, item.nextDue, today);
      if (due.length === 0) continue;
      for (const date of due) {
        writeExpense(tx, {
          amount: item.amount,
          currency: item.currency,
          categoryId: item.categoryId,
          tagIds: item.tagIds,
          date,
          description: item.description,
          recurringId: item.id,
        });
      }
      tx.update(recurring).set({ nextDue }).where(eq(recurring.id, item.id)).run();
    }
  });
}
