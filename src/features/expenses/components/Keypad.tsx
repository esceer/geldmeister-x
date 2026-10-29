import { Delete } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { decimalSeparator, type KeypadKey } from '@/lib/money';
import { colors } from '@/theme';

const rows: KeypadKey[][] = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', 'back'],
];

// Fills the remaining height unless `height` is given (sheets that size to their content).
// `onToggleSign` makes a long press on the decimal key flip the sign, even for 0-decimal currencies.
type Props = {
  decimals: number;
  onKey: (key: KeypadKey) => void;
  onToggleSign?: () => void;
  height?: number;
};

export function Keypad({ decimals, onKey, onToggleSign, height }: Props) {
  const { t, i18n } = useTranslation();

  return (
    <View style={[styles.grid, height !== undefined && { flex: 0, height }]}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key) => {
            const noDecimals = key === '.' && decimals === 0;
            const signKey = key === '.' && !!onToggleSign;
            return (
              <Pressable
                key={key}
                disabled={noDecimals && !signKey}
                accessibilityLabel={key === 'back' ? t('expense.deleteDigit') : undefined}
                accessibilityHint={signKey ? t('expense.toggleSignHint') : undefined}
                onPress={() => onKey(key)}
                onLongPress={signKey ? onToggleSign : undefined}
                style={({ pressed }) => [
                  styles.key,
                  pressed && styles.pressed,
                  noDecimals && !signKey && styles.disabled,
                ]}
              >
                {key === 'back' ? (
                  <Delete size={24} color={colors.text} strokeWidth={1.8} />
                ) : (
                  <Text size={24} weight="medium" style={noDecimals && styles.disabled}>
                    {key === '.' ? decimalSeparator(i18n.language) : key}
                  </Text>
                )}
                {signKey ? (
                  <Text size={13} weight="medium" muted style={styles.signHint}>
                    ±
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flex: 1, gap: 8 },
  row: { flex: 1, flexDirection: 'row', gap: 8 },
  key: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: 'rgba(255,255,255,0.14)' },
  disabled: { opacity: 0.3 },
  signHint: { position: 'absolute', top: 6, right: 10 },
});
