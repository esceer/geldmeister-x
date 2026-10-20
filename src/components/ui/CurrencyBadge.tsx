import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { Text } from './Text';

/** Read-only currency code chip used in sheet headers. */
export function CurrencyBadge({ code }: { code: string }) {
  return (
    <View style={styles.chip}>
      <Text size={14} weight="semibold">
        {code}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.navBorder,
  },
});
