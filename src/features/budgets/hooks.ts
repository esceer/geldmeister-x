import { and, eq, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { budgets } from '@/db/schema';
import { useQuery } from '@/db/useQuery';

/** Monthly budget per category for the currency, keyed by category id. */
export function useBudgets(currency: string): Map<string, number> {
  return useQuery(
    () =>
      new Map(
        db
          .select({ categoryId: budgets.categoryId, amount: budgets.amount })
          .from(budgets)
          .where(and(eq(budgets.currency, currency), isNull(budgets.deletedAt)))
          .all()
          .map((b) => [b.categoryId, b.amount]),
      ),
    ['budgets'],
  );
}
