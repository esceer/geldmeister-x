import { differenceInCalendarDays, endOfMonth } from 'date-fns';
import { router } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { CurrencyChip } from '@/components/CurrencyChip';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useCategories } from '@/features/categories/hooks';
import { CategoryIcon, tint } from '@/features/categories/icons';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { useMonthOverview } from '@/features/home/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate } from '@/lib/dates';
import { currencySymbol, formatAmount, formatMoney } from '@/lib/money';
import { colors } from '@/theme';

import { budgetProgress, useBudgets } from '../hooks';

/** This month's spending against per-category budgets (design: Budgets.dc.html). */
export function BudgetsScreen() {
  const { t, i18n } = useTranslation();
  const [month] = useState(() => new Date());
  const currency = useSettings((s) => s.currency);
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const categories = useCategories();
  const budgets = useBudgets(currency);
  const { byCategory } = useMonthOverview(currency, month);

  const amount = (minor: number) => formatAmount(minor, decimals, i18n.language);
  const { budget: totalBudget, spent: totalSpent } = budgetProgress(budgets, byCategory);
  const left = totalBudget - totalSpent;
  const openSheet = (categoryId: string) =>
    router.push({ pathname: '/budget', params: { categoryId } });

  return (
    <Screen back title={t('budgets.title')} right={<CurrencyChip />}>
      {totalBudget > 0 ? (
        <Card style={styles.summary}>
          <View style={styles.spread}>
            <Text size={13} muted>
              {formatDate(month, t('dates.monthYear'), i18n.language)}
            </Text>
            <Text size={13} muted>
              {t('budgets.daysLeft', {
                count: differenceInCalendarDays(endOfMonth(month), month),
              })}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text
              size={34}
              weight="bold"
              style={[styles.amount, left < 0 && { color: colors.dangerText }]}
            >
              {formatMoney(Math.abs(left), currency, decimals, i18n.language)}
            </Text>
            <Text size={16} weight="semibold" muted>
              {t(left < 0 ? 'budgets.over' : 'budgets.left')}
            </Text>
          </View>
          <ProgressBar
            value={totalSpent / totalBudget}
            height={6}
            color={left < 0 ? colors.danger : colors.text}
          />
          <Text size={13} muted>
            {t('budgets.spentOf', {
              spent: amount(totalSpent),
              budget: formatMoney(totalBudget, currency, decimals, i18n.language),
            })}
          </Text>
        </Card>
      ) : null}

      {categories.map((category) => {
        const budget = budgets.get(category.id);
        const spent = byCategory.get(category.id) ?? 0;
        const over = budget !== undefined && spent > budget;
        return (
          <Card key={category.id} style={[styles.card, over && styles.overCard]}>
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: tint(category.color) }]}>
                <CategoryIcon
                  icon={category.icon}
                  size={18}
                  color={category.color}
                  strokeWidth={1.8}
                />
              </View>
              <View style={styles.texts}>
                <Text weight="semibold" numberOfLines={1}>
                  {category.name}
                </Text>
                <Text size={12} muted>
                  {budget === undefined
                    ? t('budgets.none')
                    : `${amount(spent)} / ${amount(budget)} ${currencySymbol(currency)}`}
                </Text>
              </View>
              {budget === undefined ? (
                <Pressable onPress={() => openSheet(category.id)} hitSlop={8}>
                  <Text size={14} weight="medium" style={{ color: colors.link }}>
                    {t('budgets.set')}
                  </Text>
                </Pressable>
              ) : (
                <>
                  <Text
                    size={13}
                    weight="semibold"
                    style={{ color: over ? colors.dangerText : colors.text }}
                  >
                    {t(over ? 'budgets.amountOver' : 'budgets.amountLeft', {
                      amount: amount(Math.abs(budget - spent)),
                    })}
                  </Text>
                  <IconButton
                    Icon={Pencil}
                    label={t('budgets.edit', { name: category.name })}
                    onPress={() => openSheet(category.id)}
                  />
                </>
              )}
            </View>
            {budget !== undefined ? (
              <ProgressBar
                value={spent / budget}
                height={6}
                color={over ? colors.danger : category.color}
              />
            ) : null}
          </Card>
        );
      })}

      <Text size={13} muted style={styles.hint}>
        {t('budgets.hint')}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20, gap: 10 },
  spread: { flexDirection: 'row', justifyContent: 'space-between' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amount: { letterSpacing: -1 },
  card: { paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  overCard: { borderColor: 'rgba(255,122,122,0.45)' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  hint: { paddingHorizontal: 4, lineHeight: 19 },
});
