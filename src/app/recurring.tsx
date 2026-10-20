import { useLocalSearchParams } from 'expo-router';

import { RecurringSheet } from '@/features/recurring/components/RecurringSheet';

export default function RecurringSheetRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <RecurringSheet recurringId={id} />;
}
