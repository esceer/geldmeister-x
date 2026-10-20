import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useTags } from '@/features/categories/hooks';
import { CategoryIcon, tint } from '@/features/categories/icons';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { currencySymbol, formatAmount, formatMoney } from '@/lib/money';

import { useRecurringList } from '../hooks';
import { dueLabel, scheduleLabel } from '../labels';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Recurring expenses of the active currency (design: Recurring.dc.html). */
export function RecurringScreen() {
  const { t, i18n } = useTranslation();
  const currency = useSettings((s) => s.currency);
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const items = useRecurringList(currency);
  const tagNames = new Map(useTags().map((tag) => [tag.id, tag.name]));

  const sum = (schedule: string) =>
    items.filter((i) => i.schedule === schedule).reduce((total, i) => total + i.amount, 0);
  const monthly = sum('monthly');
  const yearly = sum('yearly');

  return (
    <Screen
      back
      title={t('recurring.title')}
      right={
        <IconButton
          Icon={Plus}
          label={t('recurring.newTitle')}
          variant="accent"
          onPress={() => router.push('/recurring')}
        />
      }
    >
      <Card style={styles.summary}>
        <Text size={13} muted>
          {t('recurring.fixedMonthly')}
        </Text>
        <View style={styles.amountRow}>
          <Text size={34} weight="bold" style={styles.amount}>
            {formatAmount(monthly, decimals, i18n.language)}
          </Text>
          <Text size={16} weight="semibold" muted>
            {currencySymbol(currency)}
          </Text>
        </View>
        {yearly > 0 ? (
          <Text size={13} muted>
            {t('recurring.plusYearly', {
              amount: formatMoney(yearly, currency, decimals, i18n.language),
            })}
          </Text>
        ) : null}
      </Card>

      <Text size={13} muted style={styles.hint}>
        {t('recurring.hint')}
      </Text>

      {items.length > 0 ? (
        <Card>
          {items.map((item, index) => {
            const names = item.tagIds
              .map((id) => tagNames.get(id))
              .filter(Boolean)
              .join(', ');
            const subtitle = [
              scheduleLabel(item.schedule, item.startDate, t, i18n.language),
              item.description,
            ]
              .filter(Boolean)
              .join(' · ');
            return (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: '/recurring', params: { id: item.id } })}
                style={[styles.row, index < items.length - 1 && styles.divider]}
              >
                <View style={[styles.icon, { backgroundColor: tint(item.categoryColor) }]}>
                  <CategoryIcon
                    icon={item.categoryIcon}
                    size={20}
                    color={item.categoryColor}
                    strokeWidth={1.8}
                  />
                </View>
                <View style={styles.texts}>
                  <Text weight="semibold" numberOfLines={1}>
                    {names ? capitalize(names) : item.categoryName}
                  </Text>
                  <Text size={12} muted numberOfLines={1}>
                    {subtitle}
                  </Text>
                </View>
                <View style={styles.right}>
                  <Text weight="semibold">
                    {formatMoney(item.amount, currency, decimals, i18n.language)}
                  </Text>
                  <Text size={12} muted>
                    {dueLabel(item.nextDue, t, i18n.language)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </Card>
      ) : (
        <Text muted style={styles.empty}>
          {t('recurring.empty')}
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20, gap: 6 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amount: { letterSpacing: -1 },
  hint: { paddingHorizontal: 4, lineHeight: 19 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  right: { alignItems: 'flex-end', gap: 2 },
  empty: { textAlign: 'center', paddingVertical: 24 },
});
