import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { DateField } from '@/components/ui/DateField';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { showSnackbar } from '@/components/ui/Snackbar';
import { TextField } from '@/components/ui/TextField';
import { CategoryTagPicker } from '@/features/categories/components/CategoryTagPicker';
import { useCategories } from '@/features/categories/hooks';
import { getCurrency } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate, toDateKey } from '@/lib/dates';
import { applyKey, inputToMinor, minorToInput } from '@/lib/money';

import { dayLabel } from '../dayLabel';
import { deleteExpense, getExpense, restoreExpense, saveExpense } from '../queries';
import { AmountDisplay } from './AmountDisplay';
import { Keypad } from './Keypad';

type Props = { expenseId?: string };

/** Add / edit expense bottom sheet (design: Add.dc.html, Edit.dc.html). */
export function ExpenseSheet({ expenseId }: Props) {
  const { t, i18n } = useTranslation();
  const activeCurrency = useSettings((s) => s.currency);
  const categories = useCategories();

  const [existing] = useState(() => (expenseId ? getExpense(expenseId) : undefined));
  // Editing keeps the expense's own currency.
  const currency = existing?.currency ?? activeCurrency;
  const [decimals] = useState(() => getCurrency(currency)?.decimals ?? 0);

  const [input, setInput] = useState(() =>
    existing ? minorToInput(existing.amount, decimals) : '',
  );
  const [selection, setSelection] = useState({
    categoryId: existing?.categoryId,
    tagIds: existing?.tagIds ?? [],
  });
  const [date, setDate] = useState(existing?.date ?? toDateKey(new Date()));
  const [description, setDescription] = useState(existing?.description ?? '');

  const categoryId = selection.categoryId ?? categories[0]?.id;
  const amount = inputToMinor(input, decimals);
  const canSave = amount > 0 && !!categoryId;

  const save = () => {
    if (!canSave) return;
    saveExpense(
      {
        amount,
        currency,
        categoryId,
        tagIds: selection.tagIds,
        date,
        description: description.trim() || null,
      },
      expenseId,
    );
    router.back();
  };

  const remove = () => {
    if (!expenseId) return;
    deleteExpense(expenseId);
    router.back();
    showSnackbar(t('expense.deleted'), {
      label: t('common.undo'),
      onPress: () => restoreExpense(expenseId),
    });
  };

  return (
    <Sheet
      fullHeight
      title={t(existing ? 'expense.editTitle' : 'expense.newTitle')}
      right={
        existing ? (
          <IconButton Icon={Trash2} label={t('expense.delete')} onPress={remove} variant="danger" />
        ) : (
          <CurrencyBadge code={currency} />
        )
      }
    >
      <AmountDisplay
        input={input}
        currency={currency}
        caption={
          existing
            ? t('expense.added', {
                currency,
                date: formatDate(existing.createdAt, t('dates.weekdayDayMonth'), i18n.language),
              })
            : undefined
        }
      />

      <CategoryTagPicker
        categoryId={categoryId}
        tagIds={selection.tagIds}
        onChange={(id, tagIds) => setSelection({ categoryId: id, tagIds })}
      />

      <View style={styles.detailsRow}>
        <DateField
          value={date}
          label={dayLabel(date, ', ', t, i18n.language)}
          onChange={setDate}
          maximumDate={new Date()}
        />
        <TextField
          compact
          value={description}
          onChangeText={setDescription}
          placeholder={t('expense.descriptionPlaceholder')}
          style={styles.description}
        />
      </View>

      <Keypad
        decimals={decimals}
        onKey={(key) => setInput((value) => applyKey(value, key, decimals))}
      />

      <Button
        label={t(existing ? 'expense.saveChanges' : 'expense.save')}
        onPress={save}
        disabled={!canSave}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  detailsRow: { flexDirection: 'row', gap: 8 },
  description: { flex: 1 },
});
