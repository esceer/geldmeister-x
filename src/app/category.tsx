import { useLocalSearchParams } from 'expo-router';

import { CategorySheet } from '@/features/categories/components/CategorySheet';

export default function CategoryRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <CategorySheet categoryId={id} />;
}
