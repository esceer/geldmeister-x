import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';

import { useCurrencies } from '../hooks';

type Props = { value: string; onSelect: (code: string) => void; onClose: () => void };

/**
 * Dropdown under a Sheet's header chip. Render it as the Sheet's last child: it is
 * positioned inside the sheet, because Android ignores touches outside a parent's bounds.
 */
export function CurrencyMenu({ value, onSelect, onClose }: Props) {
  const currencies = useCurrencies();

  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Pressable style={styles.menu}>
        {currencies.map((currency) => {
          const selected = currency.code === value;
          return (
            <Pressable
              key={currency.id}
              onPress={() => onSelect(currency.code)}
              accessibilityState={{ selected }}
              style={styles.row}
            >
              <Text weight={selected ? 'semibold' : 'medium'}>{currency.code}</Text>
              {selected ? <Check size={18} color={colors.accent} strokeWidth={2.2} /> : null}
            </Pressable>
          );
        })}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  // Just below the header: sheet padding (10) + handle (5) + gap (14) + header (40) + 6.
  menu: {
    position: 'absolute',
    top: 75,
    right: 20,
    minWidth: 120,
    paddingVertical: 6,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.sheetBorder,
    backgroundColor: colors.sheet,
    elevation: 8,
  },
  row: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
