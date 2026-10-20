import { and, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { categories, expenses, expenseTags, recurring, tags } from '@/db/schema';
import { useQuery } from '@/db/useQuery';

const listQuery = (currency: string, categoryId: string | null, limit = -1) =>
  db
    .select({
      id: expenses.id,
      amount: expenses.amount,
      date: expenses.date,
      description: expenses.description,
      schedule: recurring.schedule,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      tagNames: sql<string | null>`(
        select group_concat(${tags.name}, ', ') from ${expenseTags}
        join ${tags} on ${tags.id} = ${expenseTags.tagId}
        where ${expenseTags.expenseId} = ${expenses.id} and ${expenseTags.deletedAt} is null
      )`,
    })
    .from(expenses)
    .innerJoin(categories, eq(categories.id, expenses.categoryId))
    .leftJoin(recurring, eq(recurring.id, expenses.recurringId))
    .where(
      and(
        eq(expenses.currency, currency),
        isNull(expenses.deletedAt),
        categoryId ? eq(expenses.categoryId, categoryId) : undefined,
      ),
    )
    .orderBy(desc(expenses.date), desc(expenses.createdAt))
    .limit(limit); // -1: no limit

export type ExpenseListItem = ReturnType<ReturnType<typeof listQuery>['all']>[number];

export function useExpenseList(currency: string, categoryId: string | null, limit?: number) {
  return useQuery(
    () => listQuery(currency, categoryId, limit).all(),
    ['expenses', 'expense_tags', 'tags', 'categories', 'recurring'],
  );
}

export type DayGroup = { date: string; total: number; items: ExpenseListItem[] };

/** Groups a date-sorted list into days with day totals. */
export function groupByDay(items: ExpenseListItem[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last?.date === item.date) {
      last.items.push(item);
      last.total += item.amount;
    } else {
      groups.push({ date: item.date, total: item.amount, items: [item] });
    }
  }
  return groups;
}
