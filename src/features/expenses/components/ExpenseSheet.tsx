import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { CurrencyChip } from '@/components/CurrencyChip';
import { Button } from '@/components/ui/Button';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { DateField } from '@/components/ui/DateField';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { showSnackbar } from '@/components/ui/Snackbar';
import { TextField } from '@/components/ui/TextField';
import { CategoryTagPicker } from '@/features/categories/components/CategoryTagPicker';
import { useDefaultCategoryId } from '@/features/categories/hooks';
import { CurrencyMenu } from '@/features/currencies/components/CurrencyMenu';
import { getCurrency, useCurrencies } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate, toDateKey } from '@/lib/dates';
import { applyKey, fitInput, inputToMinor, minorToInput } from '@/lib/money';

import { dayLabel } from '../dayLabel';
import { deleteExpense, getExpense, restoreExpense, saveExpense } from '../queries';
import { AmountDisplay } from './AmountDisplay';
import { Keypad } from './Keypad';

type Props = { expenseId?: string };

/** Add / edit expense bottom sheet (design: Add.dc.html, Edit.dc.html). */
export function ExpenseSheet({ expenseId }: Props) {
  const { t, i18n } = useTranslation();
  const activeCurrency = useSettings((s) => s.currency);
  const defaultCategoryId = useDefaultCategoryId();
  const currencyCount = useCurrencies().length;

  const [existing] = useState(() => (expenseId ? getExpense(expenseId) : undefined));
  // New expenses start in the active currency; editing keeps the expense's own.
  const [currency, setCurrency] = useState(existing?.currency ?? activeCurrency);
  const [pickingCurrency, setPickingCurrency] = useState(false);
  const decimals = getCurrency(currency)?.decimals ?? 0;

  const [input, setInput] = useState(() =>
    existing ? minorToInput(existing.amount, decimals) : '',
  );
  const [selection, setSelection] = useState({
    categoryId: existing?.categoryId,
    tagIds: existing?.tagIds ?? [],
  });
  const [date, setDate] = useState(existing?.date ?? toDateKey(new Date()));
  const [description, setDescription] = useState(existing?.description ?? '');

  const categoryId = selection.categoryId ?? defaultCategoryId;
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

  const selectCurrency = (code: string) => {
    setCurrency(code);
    setInput((value) => fitInput(value, getCurrency(code)?.decimals ?? 0));
    setPickingCurrency(false);
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
        ) : currencyCount > 1 ? (
          <CurrencyChip code={currency} onPress={() => setPickingCurrency(true)} />
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

      {pickingCurrency ? (
        <CurrencyMenu
          value={currency}
          onSelect={selectCurrency}
          onClose={() => setPickingCurrency(false)}
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  detailsRow: { flexDirection: 'row', gap: 8 },
  description: { flex: 1 },
});
