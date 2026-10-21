import { endOfMonth, startOfMonth } from 'date-fns';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { useQuery } from '@/db/useQuery';
import { totalsByCategory } from '@/features/expenses/totals';
import { useSettings } from '@/features/settings/store';
import { formatDate, toDateKey } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import { colors } from '@/theme';

import { useCurrencies } from '../hooks';

/** Switch the active currency (design: Currency.dc.html). Tracked ones are managed in Settings. */
export function CurrencySheet() {
  const { t, i18n } = useTranslation();
  const [now] = useState(() => new Date());
  const active = useSettings((s) => s.currency);
  const setCurrency = useSettings((s) => s.setCurrency);
  const currencies = useCurrencies();

  const monthTotals = useQuery(() => {
    const [from, to] = [toDateKey(startOfMonth(now)), toDateKey(endOfMonth(now))];
    return new Map(
      currencies.map((c) => [
        c.code,
        totalsByCategory(c.code, from, to).reduce((sum, r) => sum + r.total, 0),
      ]),
    );
  }, ['expenses', 'currencies']);

  const select = (code: string) => {
    setCurrency(code);
    router.back();
  };

  const month = formatDate(now, 'LLLL', i18n.language);

  return (
    <Sheet title={t('currencies.title')}>
      <Text size={13} muted style={styles.hint}>
        {t('currencies.hint')}
      </Text>

      <Card>
        {currencies.map((currency, index) => {
          const selected = currency.code === active;
          return (
            <Pressable
              key={currency.id}
              onPress={() => select(currency.code)}
              accessibilityState={{ selected }}
              style={[styles.row, index < currencies.length - 1 && styles.divider]}
            >
              <View style={[styles.code, selected && styles.codeActive]}>
                <Text size={13} weight="bold" style={selected && { color: colors.onAccent }}>
                  {currency.code}
                </Text>
              </View>
              <View style={styles.texts}>
                <Text weight="semibold">{t(`currencies.names.${currency.code}`)}</Text>
                <Text size={12} muted>
                  {t('currencies.inMonth', {
                    amount: formatMoney(
                      monthTotals.get(currency.code) ?? 0,
                      currency.code,
                      currency.decimals,
                      i18n.language,
                    ),
                    month,
                  })}
                </Text>
              </View>
              {selected ? <Check size={20} color={colors.accent} strokeWidth={2.2} /> : null}
            </Pressable>
          );
        })}
      </Card>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  hint: { lineHeight: 19 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  code: {
    width: 48,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  codeActive: { backgroundColor: colors.accent },
  texts: { flex: 1, gap: 2 },
});
