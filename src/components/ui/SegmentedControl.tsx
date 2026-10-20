import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

import { Text } from './Text';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityState={{ selected }}
            style={[styles.segment, selected && styles.selected]}
          >
            <Text
              size={13}
              weight={selected ? 'semibold' : 'medium'}
              numberOfLines={1}
              style={{ color: selected ? colors.textActive : 'rgba(235,237,250,0.7)' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 2,
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  segment: {
    flex: 1,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: 'rgba(255,255,255,0.18)' },
});
