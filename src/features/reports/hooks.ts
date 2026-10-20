import { and, between, desc, eq, isNull, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { expenses, expenseTags, tags } from '@/db/schema';
import { useQuery } from '@/db/useQuery';
import { totalsByCategory } from '@/features/expenses/totals';
import { toDateKey } from '@/lib/dates';
import { recentPeriods, type PeriodKind, type Range } from '@/lib/periods';

export const HISTORY_LENGTH = 6;

const keys = (range: Range) => [toDateKey(range.from), toDateKey(range.to)] as const;

/** Per-tag totals; an expense with several tags counts for each, so they can overlap. */
function totalsByTag(currency: string, from: string, to: string) {
  const total = sql<number>`sum(${expenses.amount})`;
  return db
    .select({ tagId: tags.id, categoryId: tags.categoryId, name: tags.name, total })
    .from(expenseTags)
    .innerJoin(expenses, eq(expenses.id, expenseTags.expenseId))
    .innerJoin(tags, eq(tags.id, expenseTags.tagId))
    .where(
      and(
        eq(expenses.currency, currency),
        isNull(expenses.deletedAt),
        isNull(expenseTags.deletedAt),
        between(expenses.date, from, to),
      ),
    )
    .groupBy(tags.id)
    .orderBy(desc(total))
    .all();
}

const grandTotal = (currency: string, range: Range) =>
  totalsByCategory(currency, ...keys(range)).reduce((sum, r) => sum + r.total, 0);

/** Category and tag totals for the range, plus totals of the last periods for the trend bars. */
export function useReport(currency: string, range: Range, kind: PeriodKind | 'custom') {
  return useQuery(
    () => ({
      categories: totalsByCategory(currency, ...keys(range)),
      tags: totalsByTag(currency, ...keys(range)),
      history:
        kind === 'custom'
          ? []
          : recentPeriods(kind, range.from, HISTORY_LENGTH).map((period) => ({
              period,
              total: grandTotal(currency, period),
            })),
    }),
    ['expenses', 'expense_tags', 'tags'],
  );
}
