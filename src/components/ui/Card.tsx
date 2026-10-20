import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radius } from '@/theme';

/** Glass card surface. */
export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
});
