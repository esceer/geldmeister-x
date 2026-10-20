import { router } from 'expo-router';
import { PiggyBank, Repeat, Tags } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useBudgets } from '@/features/budgets/hooks';
import { useCategories } from '@/features/categories/hooks';
import { useActiveCurrency } from '@/features/currencies/hooks';
import { useRecurringList } from '@/features/recurring/hooks';
import { useSettings } from '@/features/settings/store';
import { formatMoney } from '@/lib/money';
import { colors } from '@/theme';

import { SettingsRow } from './SettingsRow';

/** Settings hub (design: Settings.dc.html). */
export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const categories = useCategories();
  const currency = useSettings((s) => s.currency);
  const recurringCount = useRecurringList(currency).length;
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const budgetTotal = [...useBudgets(currency).values()].reduce((sum, v) => sum + v, 0);

  return (
    <Screen title={t('settings.title')}>
      <Text size={12} weight="semibold" muted style={styles.section}>
        {t('settings.money')}
      </Text>
      <Card>
        <SettingsRow
          Icon={Tags}
          color={colors.accent}
          label={t('categories.title')}
          value={String(categories.length)}
          onPress={() => router.push('/settings/categories')}
          divider
        />
        <SettingsRow
          Icon={PiggyBank}
          color={colors.positive}
          label={t('budgets.title')}
          value={
            budgetTotal > 0
              ? formatMoney(budgetTotal, currency, decimals, i18n.language)
              : undefined
          }
          onPress={() => router.push('/settings/budgets')}
          divider
        />
        <SettingsRow
          Icon={Repeat}
          color="#FF7DB5"
          label={t('recurring.title')}
          value={t('recurring.activeCount', { count: recurringCount })}
          onPress={() => router.push('/settings/recurring')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    textTransform: 'uppercase',
    letterSpacing: 0.72,
    paddingHorizontal: 6,
    marginBottom: -6,
  },
});
