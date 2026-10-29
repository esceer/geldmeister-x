import i18n from '@/i18n';
import { newId } from '@/lib/id';

import { db } from './client';
import { categories, currencies, tags } from './schema';

const defaultCategories = [
  {
    key: 'bills',
    icon: 'receipt',
    color: '#8E9BFF',
    tags: ['loan', 'utilities', 'insurance', 'internet', 'streaming'],
  },
  {
    key: 'transport',
    icon: 'car',
    color: '#3DDCC5',
    tags: ['fuel', 'service', 'parking', 'tolls'],
  },
  { key: 'misc', icon: 'shopping-bag', color: '#FFB547', tags: ['groceries', 'dining', 'cinema'] },
];

// First launch only: HUF plus the default categories and tags, named in the device language.
export function seedIfEmpty() {
  if (db.select({ id: currencies.id }).from(currencies).limit(1).all().length > 0) return;

  db.transaction((tx) => {
    tx.insert(currencies).values({ id: newId(), code: 'HUF', decimals: 0 }).run();

    defaultCategories.forEach((category, index) => {
      const categoryId = newId();
      tx.insert(categories)
        .values({
          id: categoryId,
          name: i18n.t(`seed.${category.key}.name`),
          icon: category.icon,
          color: category.color,
          sortOrder: index,
        })
        .run();
      tx.insert(tags)
        .values(
          category.tags.map((tag, tagIndex) => ({
            id: newId(),
            categoryId,
            name: i18n.t(`seed.${category.key}.tags.${tag}`),
            sortOrder: tagIndex,
          })),
        )
        .run();
    });
  });
}
