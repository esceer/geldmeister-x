import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { fromDateKey, toDateKey } from '@/lib/dates';
import { colors, radius } from '@/theme';

import { Text } from './Text';

type Props = {
  value: string; // date key
  label: string;
  onChange: (value: string) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

/** Button showing a date; opens the native date picker. */
export function DateField({ value, label, onChange, minimumDate, maximumDate }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.field}>
        <CalendarDays size={16} color={colors.text} strokeWidth={1.8} />
        <Text size={13} weight="medium" numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={fromDateKey(value)}
          mode="date"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={(event, date) => {
            setOpen(false);
            if (event.type === 'set' && date) onChange(toDateKey(date));
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
});
