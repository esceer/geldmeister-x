import { useLocalSearchParams } from 'expo-router';

import { TagSheet } from '@/features/categories/components/TagSheet';

export default function TagRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TagSheet tagId={id} />;
}
