import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { currencySymbol, formatInput } from '@/lib/money';

type Props = { input: string; currency: string; caption?: string };

/** Large keypad amount with the currency symbol. */
export function AmountDisplay({ input, currency, caption }: Props) {
  const { i18n } = useTranslation();
  return (
    <View style={styles.amount}>
      <View style={styles.row}>
        <Text size={52} weight="bold" style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {formatInput(input, i18n.language)}
        </Text>
        <Text size={22} weight="semibold" muted>
          {currencySymbol(currency)}
        </Text>
      </View>
      {caption ? (
        <Text size={12} muted>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  amount: { alignItems: 'center', gap: 2, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  value: { letterSpacing: -1.5, flexShrink: 1 },
});
