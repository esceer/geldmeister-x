import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { tint } from '@/features/categories/icons';
import { colors } from '@/theme';

type Props = {
  Icon: LucideIcon;
  color: string;
  label: string;
  value?: string;
  onPress: () => void;
  divider?: boolean;
};

export function SettingsRow({ Icon, color, label, value, onPress, divider }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.row, divider && styles.divider]}>
      <View style={[styles.icon, { backgroundColor: tint(color) }]}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </View>
      <Text weight="medium" style={styles.label}>
        {label}
      </Text>
      {value ? (
        <Text size={14} muted>
          {value}
        </Text>
      ) : null}
      <ChevronRight size={18} color={colors.textMuted} strokeWidth={1.8} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 60, paddingHorizontal: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  icon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
