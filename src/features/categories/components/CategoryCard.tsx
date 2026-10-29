import { router } from 'expo-router';
import { GripVertical, Pencil, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';

import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { Text } from '@/components/ui/Text';
import type { Category, Tag } from '@/db/schema';
import { useSettings } from '@/features/settings/store';
import { colors } from '@/theme';

import { CategoryIcon, tint } from '../icons';
import { createTag } from '../queries';
import { AddTagChip } from './AddTagChip';
import { TagChips } from './TagChips';

type Props = { category: Category; tags: Tag[]; isDefault: boolean };

/** Category with its tags; drag the handle to reorder, star it as the default, tap a tag to rename or delete it, long-press a tag to drag it. */
export function CategoryCard({ category, tags, isDefault }: Props) {
  const { t } = useTranslation();
  const drag = useReorderableDrag();
  const setDefault = useSettings((s) => s.setDefaultCategoryId);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Pressable onPressIn={drag} hitSlop={8} accessibilityLabel={t('categories.reorder')}>
          <GripVertical size={20} color={colors.textMuted} strokeWidth={1.8} />
        </Pressable>
        <View style={[styles.icon, { backgroundColor: tint(category.color) }]}>
          <CategoryIcon icon={category.icon} size={20} color={category.color} strokeWidth={1.8} />
        </View>
        <View style={styles.texts}>
          <Text weight="semibold" numberOfLines={1}>
            {category.name}
          </Text>
          <Text size={12} muted>
            {t('categories.tagCount', { count: tags.length })}
          </Text>
        </View>
        <Pressable
          onPress={() => setDefault(category.id)}
          hitSlop={8}
          accessibilityLabel={t('categories.setDefault', { name: category.name })}
          accessibilityState={{ selected: isDefault }}
          style={styles.star}
        >
          <Star
            size={20}
            color={isDefault ? colors.accent : colors.textMuted}
            fill={isDefault ? colors.accent : 'transparent'}
            strokeWidth={1.8}
          />
        </Pressable>
        <IconButton
          Icon={Pencil}
          label={t('categories.edit', { name: category.name })}
          onPress={() => router.push({ pathname: '/category', params: { id: category.id } })}
        />
      </View>
      <TagChips tags={tags} color={category.color}>
        <AddTagChip height={30} onAdd={(name) => createTag(category.id, name)} />
      </TagChips>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  star: { width: 32, height: 40, alignItems: 'center', justifyContent: 'center' },
});
