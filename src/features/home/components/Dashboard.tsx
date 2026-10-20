import { Link } from 'expo-router';
import { subMonths } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { CurrencyChip } from '@/components/CurrencyChip';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { budgetProgress, useBudgets } from '@/features/budgets/hooks';
import { useCategories } from '@/features/categories/hooks';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { ExpenseRow } from '@/features/expenses/components/ExpenseRow';
import { useExpenseList } from '@/features/expenses/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate } from '@/lib/dates';
import { colors } from '@/theme';

import { useMonthOverview } from '../hooks';
import { SplitCard } from './SplitCard';
import { TotalCard } from './TotalCard';

const RECENT_COUNT = 5;

/** Home: month total, category split, budget progress, recent expenses (design: Home.dc.html). */
export function Dashboard() {
  const { t, i18n } = useTranslation();
  const [month] = useState(() => new Date());
  const currency = useSettings((s) => s.currency);
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const categories = useCategories({ includeArchived: true });
  const budgets = useBudgets(currency);
  const { byCategory, previousTotal } = useMonthOverview(currency, month);
  const recent = useExpenseList(currency, null, RECENT_COUNT);

  const total = [...byCategory.values()].reduce((sum, v) => sum + v, 0);
  const progress = budgetProgress(budgets, byCategory);

  return (
    <Screen
      title={t('home.title')}
      subtitle={formatDate(month, t('dates.monthYear'), i18n.language)}
      right={<CurrencyChip />}
    >
      <TotalCard
        total={total}
        previousTotal={previousTotal}
        previousMonth={formatDate(subMonths(month, 1), 'LLL', i18n.language)}
        budget={progress.budget}
        budgetSpent={progress.spent}
        currency={currency}
        decimals={decimals}
      />
      <SplitCard
        categories={categories}
        totals={byCategory}
        budgets={budgets}
        decimals={decimals}
      />

      <View style={styles.recentHeader}>
        <Text size={17} weight="semibold">
          {t('home.recent')}
        </Text>
        <Link href="/expenses">
          <Text size={14} weight="medium" style={{ color: colors.link }}>
            {t('home.seeAll')}
          </Text>
        </Link>
      </View>
      {recent.length > 0 ? (
        <Card>
          {recent.map((item, index) => (
            <ExpenseRow
              key={item.id}
              item={item}
              currency={currency}
              decimals={decimals}
              divider={index < recent.length - 1}
              showDay
            />
          ))}
        </Card>
      ) : (
        <Text muted style={styles.empty}>
          {t('expenses.empty')}
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  empty: { textAlign: 'center', paddingVertical: 24 },
});
