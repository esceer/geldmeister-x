import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';

import { useCategories, useTags } from '../hooks';
import { CategoryIcon, tint } from '../icons';
import { createTag } from '../queries';
import { AddTagChip } from './AddTagChip';

type Props = {
  categoryId: string | undefined;
  tagIds: string[];
  onChange: (categoryId: string, tagIds: string[]) => void;
};

/** Category buttons plus the selected category's tags (multi-select, with inline add). */
export function CategoryTagPicker({ categoryId, tagIds, onChange }: Props) {
  const categories = useCategories();
  const tags = useTags();
  const selected = categories.find((c) => c.id === categoryId);

  return (
    <>
      <View style={styles.wrap}>
        {categories.map((category) => {
          const active = category.id === categoryId;
          return (
            <Pressable
              key={category.id}
              // Tags belong to their category, so switching clears them.
              onPress={() => !active && onChange(category.id, [])}
              accessibilityState={{ selected: active }}
              style={[
                styles.category,
                active && {
                  backgroundColor: tint(category.color, 0.2),
                  borderColor: category.color,
                },
              ]}
            >
              <CategoryIcon
                icon={category.icon}
                size={16}
                color={category.color}
                strokeWidth={1.8}
              />
              <Text size={13} weight={active ? 'semibold' : 'medium'} numberOfLines={1}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selected ? (
        <View style={styles.wrap}>
          {tags
            .filter((tag) => tag.categoryId === selected.id)
            .map((tag) => {
              const active = tagIds.includes(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  onPress={() =>
                    onChange(
                      selected.id,
                      active ? tagIds.filter((id) => id !== tag.id) : [...tagIds, tag.id],
                    )
                  }
                  accessibilityState={{ selected: active }}
                  style={[styles.tag, active && { backgroundColor: selected.color }]}
                >
                  <Text
                    size={13}
                    weight={active ? 'semibold' : 'medium'}
                    style={active && { color: colors.onAccent }}
                  >
                    # {tag.name}
                  </Text>
                </Pressable>
              );
            })}
          <AddTagChip
            onAdd={(name) => onChange(selected.id, [...tagIds, createTag(selected.id, name)])}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    flexGrow: 1,
    flexBasis: '30%',
    height: 44,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  tag: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
});
