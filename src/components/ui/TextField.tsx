import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

export function TextField({ style, ...rest }: TextInputProps) {
  return (
    <TextInput placeholderTextColor={colors.textMuted} style={[styles.field, style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
