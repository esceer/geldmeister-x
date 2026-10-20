import { endOfMonth, startOfMonth, subMonths } from 'date-fns';

import { useQuery } from '@/db/useQuery';
import { totalsByCategory } from '@/features/expenses/totals';
import { toDateKey } from '@/lib/dates';

const monthTotals = (currency: string, month: Date) =>
  totalsByCategory(currency, toDateKey(startOfMonth(month)), toDateKey(endOfMonth(month)));

/** This month's totals per category plus last month's grand total, for the dashboard. */
export function useMonthOverview(currency: string, month: Date) {
  return useQuery(() => {
    const byCategory = new Map(monthTotals(currency, month).map((r) => [r.categoryId, r.total]));
    const previousTotal = monthTotals(currency, subMonths(month, 1)).reduce(
      (sum, r) => sum + r.total,
      0,
    );
    return { byCategory, previousTotal };
  }, ['expenses']);
}
