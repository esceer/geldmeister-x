import { router } from 'expo-router';
import { Archive } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing } from '@/theme';

import { CategoryIcon, categoryColors, categoryIcons, tint } from '../icons';
import { archiveCategory, createCategory, getCategory, updateCategory } from '../queries';

type Props = { categoryId?: string };

/** Create or edit a category: name, color and icon; editing can archive it. */
export function CategorySheet({ categoryId }: Props) {
  const { t } = useTranslation();
  const tileSize = (useWindowDimensions().width - spacing.screen * 2 - 7 * 6) / 8; // 8 per row
  const [existing] = useState(() => (categoryId ? getCategory(categoryId) : undefined));
  const [name, setName] = useState(existing?.name ?? '');
  const [color, setColor] = useState(existing?.color ?? categoryColors[0]);
  const [icon, setIcon] = useState(existing?.icon ?? 'shopping-bag');

  const save = () => {
    const input = { name: name.trim(), color, icon };
    if (categoryId) updateCategory(categoryId, input);
    else createCategory(input);
    router.back();
  };

  const archive = () =>
    Alert.alert(
      t('categories.archiveTitle', { name: existing?.name }),
      t('categories.archiveMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('categories.archive'),
          style: 'destructive',
          onPress: () => {
            if (categoryId) archiveCategory(categoryId);
            router.back();
          },
        },
      ],
    );

  return (
    <Sheet
      title={t(existing ? 'categories.editTitle' : 'categories.newTitle')}
      right={
        existing ? (
          <IconButton
            Icon={Archive}
            label={t('categories.archive')}
            onPress={archive}
            variant="danger"
          />
        ) : undefined
      }
    >
      <TextField
        value={name}
        onChangeText={setName}
        placeholder={t('categories.namePlaceholder')}
        autoFocus={!existing}
      />

      <View style={styles.swatches}>
        {categoryColors.map((value) => (
          <Pressable
            key={value}
            onPress={() => setColor(value)}
            accessibilityLabel={value}
            accessibilityState={{ selected: value === color }}
            style={[styles.swatch, value === color && { borderColor: value }]}
          >
            <View style={[styles.swatchFill, { backgroundColor: value }]} />
          </Pressable>
        ))}
      </View>

      <View style={styles.icons}>
        {Object.keys(categoryIcons).map((key) => {
          const selected = key === icon;
          return (
            <Pressable
              key={key}
              onPress={() => setIcon(key)}
              accessibilityLabel={key}
              accessibilityState={{ selected }}
              style={[
                styles.iconTile,
                { width: tileSize, height: tileSize },
                selected && { backgroundColor: tint(color, 0.2), borderColor: color },
              ]}
            >
              <CategoryIcon
                icon={key}
                size={20}
                color={selected ? color : colors.textMuted}
                strokeWidth={1.8}
              />
            </Pressable>
          );
        })}
      </View>

      <Button label={t('common.save')} onPress={save} disabled={!name.trim()} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  swatches: { flexDirection: 'row', justifyContent: 'space-between' },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchFill: { width: 24, height: 24, borderRadius: 12 },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  iconTile: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
