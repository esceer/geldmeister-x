import DateTimePicker from '@react-native-community/datetimepicker';
import { endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { CurrencyChip } from '@/components/CurrencyChip';
import { Screen } from '@/components/ui/Screen';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Text } from '@/components/ui/Text';
import { useCategories } from '@/features/categories/hooks';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate } from '@/lib/dates';
import { periodRange, shiftPeriod, type PeriodKind, type Range } from '@/lib/periods';
import { colors } from '@/theme';

import { formatRange } from '../formatRange';
import { useReport } from '../hooks';
import { CategoryTable } from './CategoryTable';
import { SummaryCard } from './SummaryCard';

type Kind = PeriodKind | 'custom';
const kinds: Kind[] = ['week', 'month', 'quarter', 'year', 'custom'];

/** Period report: totals per category, expandable to tags (design: Reports.dc.html). */
export function Reports() {
  const { t, i18n } = useTranslation();
  const currency = useSettings((s) => s.currency);
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const categories = useCategories();

  const [kind, setKind] = useState<Kind>('month');
  const [anchor, setAnchor] = useState(() => new Date());
  const [custom, setCustom] = useState<Range>(() => ({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  }));
  const [picking, setPicking] = useState<'from' | 'to' | null>(null);

  const range = kind === 'custom' ? custom : periodRange(kind, anchor);
  const report = useReport(currency, range, kind);
  const total = report.categories.reduce((sum, r) => sum + r.total, 0);

  const shift = (amount: number) =>
    kind !== 'custom' && setAnchor(shiftPeriod(kind, anchor, amount));

  return (
    <Screen title={t('reports.title')} right={<CurrencyChip />}>
      <SegmentedControl
        options={kinds.map((value) => ({ value, label: t(`reports.kinds.${value}`) }))}
        value={kind}
        onChange={setKind}
      />

      {kind === 'custom' ? (
        <View style={styles.customRow}>
          {(['from', 'to'] as const).map((end) => (
            <Pressable key={end} onPress={() => setPicking(end)} style={styles.dateButton}>
              <Text size={12} muted>
                {t(`reports.${end}`)}
              </Text>
              <Text weight="semibold">
                {formatDate(custom[end], t('dates.dayMonthYear'), i18n.language)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.navRow}>
          <Pressable
            onPress={() => shift(-1)}
            accessibilityLabel={t('reports.previous')}
            style={styles.navButton}
          >
            <ChevronLeft size={18} color={colors.text} strokeWidth={2} />
          </Pressable>
          <Text size={16} weight="semibold">
            {formatRange(range, t, i18n.language)}
          </Text>
          <Pressable
            onPress={() => shift(1)}
            accessibilityLabel={t('reports.next')}
            style={styles.navButton}
          >
            <ChevronRight size={18} color={colors.text} strokeWidth={2} />
          </Pressable>
        </View>
      )}

      <SummaryCard
        total={total}
        kind={kind}
        history={report.history}
        currency={currency}
        decimals={decimals}
      />
      <CategoryTable
        categories={categories}
        categoryTotals={report.categories}
        tagTotals={report.tags}
        decimals={decimals}
      />

      {picking ? (
        <DateTimePicker
          value={custom[picking]}
          mode="date"
          minimumDate={picking === 'to' ? custom.from : undefined}
          maximumDate={picking === 'from' ? custom.to : undefined}
          onChange={(event, value) => {
            setPicking(null);
            if (event.type === 'set' && value) setCustom((c) => ({ ...c, [picking]: value }));
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customRow: { flexDirection: 'row', gap: 8 },
  dateButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
});
