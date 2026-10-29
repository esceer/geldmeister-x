import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, fonts, radius } from '@/theme';

type Props = { onAdd: (name: string) => void; onFocus?: () => void; height?: number };

/** Dashed "+ Tag" chip that turns into an inline input. */
export function AddTagChip({ onAdd, onFocus, height = 32 }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState<string | null>(null);
  // Enter fires submit and then blur (with a stale `name`); add only once per edit.
  const added = useRef(false);

  const open = () => {
    added.current = false;
    setName('');
  };

  const submit = () => {
    const value = name?.trim();
    if (value && !added.current) {
      added.current = true;
      onAdd(value);
    }
    setName(null);
  };

  if (name === null) {
    return (
      <Pressable onPress={open} style={[styles.chip, { height }]}>
        <Text size={13} weight="medium" muted>
          {t('tags.add')}
        </Text>
      </Pressable>
    );
  }
  return (
    <TextInput
      autoFocus
      autoCapitalize="none"
      value={name}
      onChangeText={setName}
      onFocus={onFocus}
      onSubmitEditing={submit}
      onBlur={submit}
      placeholder={t('tags.placeholder')}
      placeholderTextColor={colors.textMuted}
      style={[styles.chip, styles.input, { height }]}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  input: {
    minWidth: 100,
    paddingVertical: 0,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
});
