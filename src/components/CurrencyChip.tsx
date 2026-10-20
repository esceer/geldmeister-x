import { ChevronDown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useSettings } from '@/features/settings/store';
import { colors } from '@/theme';

/** Active currency chip shown in screen headers. */
export function CurrencyChip() {
  const currency = useSettings((s) => s.currency);

  return (
    <View style={styles.chip}>
      <Text size={14} weight="semibold">
        {currency}
      </Text>
      <ChevronDown size={16} color={colors.text} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.navBorder,
    backgroundColor: colors.chip,
  },
});
