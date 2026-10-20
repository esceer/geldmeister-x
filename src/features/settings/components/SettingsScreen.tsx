import { router } from 'expo-router';
import { Coins, Languages, PiggyBank, Repeat, Tags } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useBudgets } from '@/features/budgets/hooks';
import { useCategories } from '@/features/categories/hooks';
import { useActiveCurrency, useCurrencies } from '@/features/currencies/hooks';
import { useRecurringList } from '@/features/recurring/hooks';
import { formatMoney } from '@/lib/money';
import { colors } from '@/theme';

import { useSettings } from '../store';
import { SettingsRow } from './SettingsRow';

/** Settings hub (design: Settings.dc.html). The theme row waits for a light palette. */
export function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const currency = useSettings((s) => s.currency);
  const language = useSettings((s) => s.language);
  const currencies = useCurrencies();
  const categories = useCategories();
  const decimals = useActiveCurrency()?.decimals ?? 0;
  const budgetTotal = [...useBudgets(currency).values()].reduce((sum, v) => sum + v, 0);
  const recurringCount = useRecurringList(currency).length;

  return (
    <Screen title={t('settings.title')}>
      <Text size={12} weight="semibold" muted style={styles.section}>
        {t('settings.money')}
      </Text>
      <Card>
        <SettingsRow
          Icon={Coins}
          color="#FFB547"
          label={t('currencies.title')}
          value={currencies.map((c) => c.code).join(', ')}
          onPress={() => router.push('/currency')}
          divider
        />
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

      <Text size={12} weight="semibold" muted style={styles.section}>
        {t('settings.preferences')}
      </Text>
      <Card>
        <SettingsRow
          Icon={Languages}
          color={colors.text}
          label={t('settings.language')}
          value={t(`settings.languages.${language}`)}
          onPress={() => router.push('/language')}
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
