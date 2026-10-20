import { useLocalSearchParams } from 'expo-router';

import { BudgetSheet } from '@/features/budgets/components/BudgetSheet';

export default function BudgetRoute() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  return <BudgetSheet categoryId={categoryId} />;
}
