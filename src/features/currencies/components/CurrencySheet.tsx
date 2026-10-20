import { endOfMonth, startOfMonth } from 'date-fns';
import { router } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
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
import { colors, radius } from '@/theme';

import { currencyCatalog } from '../catalog';
import { addCurrency, useCurrencies } from '../hooks';

/** Switch the active currency or add one (design: Currency.dc.html). */
export function CurrencySheet() {
  const { t, i18n } = useTranslation();
  const [now] = useState(() => new Date());
  const active = useSettings((s) => s.currency);
  const setCurrency = useSettings((s) => s.setCurrency);
  const currencies = useCurrencies();
  const [adding, setAdding] = useState(false);

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

  const add = (code: string) => {
    addCurrency(code);
    select(code);
  };

  const available = currencyCatalog.filter((code) => !currencies.some((c) => c.code === code));
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

      {adding ? (
        <View style={styles.available}>
          {available.map((code) => (
            <Pressable key={code} onPress={() => add(code)} style={styles.option}>
              <Text size={13} weight="semibold">
                {code}
              </Text>
              <Text size={12} muted>
                {t(`currencies.names.${code}`)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Pressable onPress={() => setAdding(true)} style={styles.addButton}>
          <Plus size={18} color={colors.link} strokeWidth={2} />
          <Text weight="semibold" style={{ color: colors.link }}>
            {t('currencies.add')}
          </Text>
        </Pressable>
      )}
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
  addButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.control,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  available: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    flexBasis: '31%',
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 2,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
});
