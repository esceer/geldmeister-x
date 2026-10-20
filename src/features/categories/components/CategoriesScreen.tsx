import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import ReorderableList, { reorderItems } from 'react-native-reorderable-list';

import { IconButton } from '@/components/ui/IconButton';
import { ScreenHeader, useScreenContentStyle } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';

import { useCategories, useTags } from '../hooks';
import { reorderCategories } from '../queries';
import { CategoryCard } from './CategoryCard';

/** Category & tag management (design: Categories.dc.html). */
export function CategoriesScreen() {
  const { t } = useTranslation();
  const contentStyle = useScreenContentStyle();
  const categories = useCategories();
  const tags = useTags();

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.fill}>
      <ReorderableList
        data={categories}
        extraData={tags} // rows read tags from the closure
        keyExtractor={(category) => category.id}
        contentContainerStyle={contentStyle}
        keyboardShouldPersistTaps="handled"
        onReorder={({ from, to }) =>
          reorderCategories(reorderItems(categories, from, to).map((c) => c.id))
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader
              back
              title={t('categories.title')}
              right={
                <IconButton
                  Icon={Plus}
                  label={t('categories.new')}
                  variant="accent"
                  onPress={() => router.push('/category')}
                />
              }
            />
            <Text size={13} muted style={styles.hint}>
              {t('categories.hint')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CategoryCard category={item} tags={tags.filter((tag) => tag.categoryId === item.id)} />
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { gap: 14 },
  hint: { paddingHorizontal: 4, lineHeight: 19 },
});
