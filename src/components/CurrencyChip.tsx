import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useSettings } from '@/features/settings/store';
import { colors } from '@/theme';

/** Active currency chip in screen headers; opens the currency switcher. */
export function CurrencyChip() {
  const { t } = useTranslation();
  const currency = useSettings((s) => s.currency);

  return (
    <Pressable
      onPress={() => router.push('/currency')}
      accessibilityLabel={t('currencies.switch', { code: currency })}
      style={styles.chip}
    >
      <Text size={14} weight="semibold">
        {currency}
      </Text>
      <ChevronDown size={16} color={colors.text} strokeWidth={2} />
    </Pressable>
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
