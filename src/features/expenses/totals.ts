import { and, between, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { expenses } from '@/db/schema';

/** Sum of expenses per category for a currency within [from, to] (date keys, inclusive). */
export function totalsByCategory(currency: string, from: string, to: string) {
  return db
    .select({ categoryId: expenses.categoryId, total: sql<number>`sum(${expenses.amount})` })
    .from(expenses)
    .where(
      and(
        eq(expenses.currency, currency),
        isNull(expenses.deletedAt),
        between(expenses.date, from, to),
      ),
    )
    .groupBy(expenses.categoryId)
    .all();
}
