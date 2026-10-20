import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { CurrencyChip } from '@/components/CurrencyChip';
import { Card } from '@/components/ui/Card';
import { ScreenHeader, useScreenContentStyle } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useCategories } from '@/features/categories/hooks';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { formatMoney } from '@/lib/money';
import { colors, fonts } from '@/theme';

import { dayLabel } from '../dayLabel';
import { groupByDay, useExpenseList } from '../hooks';
import { ExpenseRow } from './ExpenseRow';

/** Expenses grouped by day, with search and category filter (design: Expenses.dc.html). */
export function ExpenseList() {
  const { t, i18n } = useTranslation();
  const contentStyle = useScreenContentStyle();
  const currency = useSettings((s) => s.currency);
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const categories = useCategories();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const items = useExpenseList(currency, categoryId).filter(
    (item) =>
      !query ||
      item.tagNames?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query),
  );
  const groups = groupByDay(items);
  const money = (minor: number) => formatMoney(minor, currency, decimals, i18n.language);

  const filters = [{ id: null, name: t('expenses.all') }, ...categories];

  return (
    <FlatList
      data={groups}
      keyExtractor={(group) => group.date}
      contentContainerStyle={contentStyle}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <ScreenHeader title={t('expenses.title')} right={<CurrencyChip />} />
          <View style={styles.search}>
            <Search size={18} color={colors.textMuted} strokeWidth={1.8} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('expenses.searchPlaceholder')}
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {filters.map((filter) => {
              const selected = filter.id === categoryId;
              return (
                <Pressable
                  key={filter.id ?? 'all'}
                  onPress={() => setCategoryId(filter.id)}
                  accessibilityState={{ selected }}
                  style={[styles.filter, selected && styles.filterSelected]}
                >
                  <Text
                    size={13}
                    weight={selected ? 'semibold' : 'medium'}
                    style={selected && { color: colors.bg }}
                  >
                    {filter.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      }
      ListEmptyComponent={
        <Text muted style={styles.empty}>
          {t(query || categoryId ? 'expenses.noResults' : 'expenses.empty')}
        </Text>
      }
      renderItem={({ item: group }) => (
        <View style={styles.group}>
          <View style={styles.groupHeader}>
            <Text size={13} weight="semibold" muted>
              {dayLabel(group.date, ' · ', t, i18n.language)}
            </Text>
            <Text size={13} muted>
              {money(group.total)}
            </Text>
          </View>
          <Card>
            {group.items.map((item, index) => (
              <ExpenseRow
                key={item.id}
                item={item}
                currency={currency}
                decimals={decimals}
                divider={index < group.items.length - 1}
              />
            ))}
          </Card>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: 14 },
  search: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  filters: { gap: 8 },
  filter: {
    height: 34,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.chip,
  },
  filterSelected: { backgroundColor: colors.text, borderColor: colors.text },
  group: { gap: 8 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 6 },
  empty: { textAlign: 'center', paddingVertical: 40 },
});
