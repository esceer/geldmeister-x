import { ArrowDownRight, ArrowUpRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { formatAmount, formatMoney, currencySymbol } from '@/lib/money';
import { colors } from '@/theme';

type Props = {
  total: number;
  previousTotal: number;
  previousMonth: string;
  budget: number;
  budgetSpent: number; // spending in budgeted categories
  currency: string;
  decimals: number;
};

/** "Spent this month" with trend vs last month and overall budget progress. */
export function TotalCard({
  total,
  previousTotal,
  previousMonth,
  budget,
  budgetSpent,
  currency,
  decimals,
}: Props) {
  const { t, i18n } = useTranslation();
  const change = previousTotal > 0 ? (total - previousTotal) / previousTotal : null;
  const up = change !== null && change > 0;
  const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
  const trendColor = up ? colors.dangerText : colors.positive;

  return (
    <Card style={styles.card}>
      <Text size={13} muted>
        {t('home.spentThisMonth')}
      </Text>
      <View style={styles.amount}>
        <Text size={40} weight="bold" style={styles.amountText}>
          {formatAmount(total, decimals, i18n.language)}
        </Text>
        <Text size={18} weight="semibold" muted>
          {currencySymbol(currency)}
        </Text>
      </View>
      {change !== null || budget > 0 ? (
        <View style={styles.meta}>
          {change !== null ? (
            <View
              style={[
                styles.trend,
                { backgroundColor: up ? 'rgba(255,122,122,0.16)' : colors.positiveBg },
              ]}
            >
              <TrendIcon size={14} color={trendColor} strokeWidth={2.2} />
              <Text size={13} weight="semibold" style={{ color: trendColor }}>
                {t('home.vsMonth', {
                  percent: Math.abs(change * 100).toFixed(1),
                  month: previousMonth,
                })}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {budget > 0 ? (
            <Text size={13} muted>
              {t('home.ofBudget', {
                amount: formatMoney(budget, currency, decimals, i18n.language),
              })}
            </Text>
          ) : null}
        </View>
      ) : null}
      {budget > 0 ? (
        <ProgressBar
          value={budgetSpent / budget}
          height={6}
          color={budgetSpent > budget ? colors.danger : colors.text}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, gap: 12 },
  amount: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amountText: { letterSpacing: -1.2 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});
