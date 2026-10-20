import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { formatDate } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import type { PeriodKind, Range } from '@/lib/periods';
import { colors } from '@/theme';

const BAR_HEIGHT = 64;
const barLabel: Record<PeriodKind, string> = {
  week: 'd',
  month: 'LLLLL',
  quarter: 'QQQ',
  year: 'yyyy',
};
const previousLabel: Record<Exclude<PeriodKind, 'week'>, string> = {
  month: 'LLL',
  quarter: 'QQQ',
  year: 'yyyy',
};

type Props = {
  total: number;
  kind: PeriodKind | 'custom';
  history: { period: Range; total: number }[]; // last periods, current one last
  currency: string;
  decimals: number;
};

/** Period total, difference to the previous period and a small bar chart of recent periods. */
export function SummaryCard({ total, kind, history, currency, decimals }: Props) {
  const { t, i18n } = useTranslation();
  const money = (minor: number) => formatMoney(minor, currency, decimals, i18n.language);
  const previous = history.at(-2);
  const max = Math.max(...history.map((h) => h.total), 1);

  let comparison: { text: string; color: string } | null = null;
  if (kind !== 'custom' && previous) {
    const period =
      kind === 'week'
        ? t('reports.previousWeek')
        : formatDate(previous.period.from, previousLabel[kind], i18n.language);
    const diff = total - previous.total;
    comparison =
      diff === 0
        ? { text: t('reports.sameAs', { period }), color: colors.textMuted }
        : {
            text: t(diff < 0 ? 'reports.lessThan' : 'reports.moreThan', {
              amount: money(Math.abs(diff)),
              period,
            }),
            color: diff < 0 ? colors.positive : colors.dangerText,
          };
  }

  return (
    <Card style={styles.card}>
      <View style={styles.texts}>
        <Text size={13} muted>
          {t('reports.totalSpent')}
        </Text>
        <Text size={30} weight="bold" style={styles.total} numberOfLines={1} adjustsFontSizeToFit>
          {money(total)}
        </Text>
        {comparison ? (
          <Text size={12} style={{ color: comparison.color }}>
            {comparison.text}
          </Text>
        ) : null}
      </View>
      {kind !== 'custom' ? (
        <View style={styles.bars}>
          {history.map(({ period, total: value }, i) => {
            const current = i === history.length - 1;
            return (
              <View key={period.from.toISOString()} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max((value / max) * BAR_HEIGHT, 2),
                      backgroundColor: current ? colors.accent : 'rgba(255,255,255,0.2)',
                    },
                  ]}
                />
                <Text size={10} weight={current ? 'bold' : 'regular'} muted={!current}>
                  {formatDate(period.from, barLabel[kind], i18n.language)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  texts: { flexShrink: 1, gap: 4 },
  total: { letterSpacing: -0.9 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: BAR_HEIGHT + 20 },
  barColumn: { alignItems: 'center', gap: 4 },
  bar: { width: 12, borderRadius: 4 },
});
