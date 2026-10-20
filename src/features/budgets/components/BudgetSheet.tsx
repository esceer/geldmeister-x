import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { getCategory } from '@/features/categories/queries';
import { getCurrency } from '@/features/currencies/hooks';
import { AmountDisplay } from '@/features/expenses/components/AmountDisplay';
import { Keypad } from '@/features/expenses/components/Keypad';
import { useSettings } from '@/features/settings/store';
import { applyKey, inputToMinor, minorToInput } from '@/lib/money';

import { getBudget, removeBudget, setBudget } from '../queries';

/** Set or remove a category's monthly budget in the active currency. */
export function BudgetSheet({ categoryId }: { categoryId: string }) {
  const { t } = useTranslation();
  const currency = useSettings((s) => s.currency);
  const [category] = useState(() => getCategory(categoryId));
  const [decimals] = useState(() => getCurrency(currency)?.decimals ?? 0);
  const [existing] = useState(() => {
    const budget = getBudget(categoryId, currency);
    return budget && !budget.deletedAt ? budget : undefined;
  });
  const [input, setInput] = useState(() =>
    existing ? minorToInput(existing.amount, decimals) : '',
  );
  const amount = inputToMinor(input, decimals);

  const save = () => {
    setBudget(categoryId, currency, amount);
    router.back();
  };

  const remove = () => {
    removeBudget(categoryId, currency);
    router.back();
  };

  return (
    <Sheet
      title={t('budgets.sheetTitle', { name: category?.name })}
      right={
        existing ? (
          <IconButton Icon={Trash2} label={t('budgets.remove')} onPress={remove} variant="danger" />
        ) : undefined
      }
    >
      <AmountDisplay input={input} currency={currency} caption={t('budgets.perMonth')} />
      <Keypad
        decimals={decimals}
        onKey={(key) => setInput((value) => applyKey(value, key, decimals))}
        height={280}
      />
      <Button label={t('common.save')} onPress={save} disabled={amount <= 0} />
    </Sheet>
  );
}
