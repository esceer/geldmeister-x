import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme';

import { Text } from './Text';

type Props = { label: string; onPress: () => void; disabled?: boolean };

/** Full-width primary button. */
export function Button({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text size={16} weight="bold" style={{ color: colors.onAccent }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.4 },
});
