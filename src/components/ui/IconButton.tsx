import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@/theme';

type Props = {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger' | 'accent';
};

/** Round 40px icon button. */
export function IconButton({ Icon, label, onPress, variant = 'default' }: Props) {
  const color =
    variant === 'danger' ? colors.dangerText : variant === 'accent' ? colors.onAccent : colors.text;
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      hitSlop={4}
      style={[styles.button, variant !== 'default' && styles[variant]]}
    >
      <Icon size={18} color={color} strokeWidth={variant === 'accent' ? 2.4 : 1.9} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: 'rgba(255,90,90,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,122,122,0.35)',
  },
  accent: { backgroundColor: colors.accent },
});
