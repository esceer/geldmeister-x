import { useTranslation } from 'react-i18next';
import { StyleSheet, Switch, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { useSettings } from '@/features/settings/store';
import { colors } from '@/theme';

import { currencyCatalog } from '../catalog';
import { setTracked, useCurrencies } from '../hooks';

/** Choose which currencies are tracked; hidden ones keep their data. */
export function CurrenciesScreen() {
  const { t } = useTranslation();
  const active = useSettings((s) => s.currency);
  const setActive = useSettings((s) => s.setCurrency);
  const tracked = useCurrencies().map((c) => c.code);

  const toggle = (code: string, on: boolean) => {
    setTracked(code, on);
    // Screens are scoped to the active currency, so move off a hidden one.
    if (!on && code === active) setActive(tracked.find((c) => c !== code)!);
  };

  return (
    <Screen back title={t('currencies.title')}>
      <Text size={13} muted style={styles.hint}>
        {t('currencies.hint')}
      </Text>
      <Card>
        {currencyCatalog.map((code, index) => {
          const on = tracked.includes(code);
          return (
            <View
              key={code}
              style={[styles.row, index < currencyCatalog.length - 1 && styles.divider]}
            >
              <View style={styles.code}>
                <Text size={13} weight="bold">
                  {code}
                </Text>
              </View>
              <Text weight="semibold" style={styles.name}>
                {t(`currencies.names.${code}`)}
              </Text>
              <Switch
                value={on}
                // At least one currency stays tracked.
                disabled={on && tracked.length === 1}
                onValueChange={(value) => toggle(code, value)}
                accessibilityLabel={t(`currencies.names.${code}`)}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.accent }}
                thumbColor={colors.text}
              />
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { paddingHorizontal: 4, lineHeight: 19 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
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
  name: { flex: 1 },
});
