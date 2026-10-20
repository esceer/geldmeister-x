import { and, asc, eq, isNull } from 'drizzle-orm';

import { db } from '@/db/client';
import { categories, recurring } from '@/db/schema';
import { useQuery } from '@/db/useQuery';

/** Active recurring expenses of a currency, soonest first. */
export function useRecurringList(currency: string) {
  return useQuery(
    () =>
      db
        .select({
          id: recurring.id,
          amount: recurring.amount,
          description: recurring.description,
          schedule: recurring.schedule,
          startDate: recurring.startDate,
          nextDue: recurring.nextDue,
          tagIds: recurring.tagIds,
          categoryName: categories.name,
          categoryIcon: categories.icon,
          categoryColor: categories.color,
        })
        .from(recurring)
        .innerJoin(categories, eq(categories.id, recurring.categoryId))
        .where(and(eq(recurring.currency, currency), isNull(recurring.deletedAt)))
        .orderBy(asc(recurring.nextDue))
        .all(),
    ['recurring', 'categories'],
  );
}

export type RecurringListItem = ReturnType<typeof useRecurringList>[number];
