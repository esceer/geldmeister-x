import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Donut } from '@/components/ui/Donut';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import type { Category } from '@/db/schema';
import { formatAmount } from '@/lib/money';
import { colors } from '@/theme';

type Props = {
  categories: Category[];
  totals: Map<string, number>;
  budgets: Map<string, number>;
  decimals: number;
};

/** Donut of this month's split per category, with per-category budget progress. */
export function SplitCard({ categories, totals, budgets, decimals }: Props) {
  const { t, i18n } = useTranslation();
  const rows = categories
    .map((category) => ({
      category,
      total: totals.get(category.id) ?? 0,
      budget: budgets.get(category.id),
    }))
    .filter((row) => row.total > 0 || (row.budget && !row.category.deletedAt));
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const top = rows.reduce<(typeof rows)[number] | undefined>(
    (best, row) => (!best || row.total > best.total ? row : best),
    undefined,
  );

  return (
    <Card style={styles.card}>
      <Donut segments={rows.map((row) => ({ value: row.total, color: row.category.color }))}>
        {top && total > 0 ? (
          <>
            <Text size={20} weight="bold">
              {Math.round((top.total / total) * 100)}%
            </Text>
            <Text size={11} muted numberOfLines={1} style={styles.topName}>
              {top.category.name}
            </Text>
          </>
        ) : null}
      </Donut>
      <View style={styles.rows}>
        {rows.length === 0 ? (
          <Text size={13} muted>
            {t('home.noExpensesMonth')}
          </Text>
        ) : null}
        {rows.map(({ category, total: spent, budget }) => {
          const over = budget !== undefined && spent > budget;
          return (
            <View key={category.id} style={styles.row}>
              <View style={styles.rowHeader}>
                <View style={styles.name}>
                  <View style={[styles.dot, { backgroundColor: category.color }]} />
                  <Text size={13} numberOfLines={1} style={styles.shrink}>
                    {category.name}
                  </Text>
                </View>
                <Text size={13} weight="semibold" style={over && { color: colors.dangerText }}>
                  {formatAmount(spent, decimals, i18n.language)}
                </Text>
              </View>
              {budget ? (
                <ProgressBar value={spent / budget} color={over ? colors.danger : category.color} />
              ) : null}
              {over ? (
                <Text size={11} style={{ color: colors.dangerText }}>
                  {t('home.ofBudgetPercent', { percent: Math.round((spent / budget) * 100) })}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  topName: { maxWidth: 80 },
  rows: { flex: 1, gap: 12 },
  row: { gap: 4 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  name: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  shrink: { flexShrink: 1 },
});
