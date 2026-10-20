import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

/** Glass text input; `compact` matches the 44px controls in sheets. */
export function TextField({ style, compact, ...rest }: TextInputProps & { compact?: boolean }) {
  return (
    <TextInput
      placeholderTextColor={colors.textMuted}
      style={[styles.field, compact && styles.compact, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  compact: { height: 44, fontSize: 13 },
});
