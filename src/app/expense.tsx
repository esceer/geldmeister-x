import { useLocalSearchParams } from 'expo-router';

import { ExpenseSheet } from '@/features/expenses/components/ExpenseSheet';

export default function ExpenseRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ExpenseSheet expenseId={id} />;
}
