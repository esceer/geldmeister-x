import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { CurrencyBadge } from '@/components/ui/CurrencyBadge';
import { DateField } from '@/components/ui/DateField';
import { IconButton } from '@/components/ui/IconButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Sheet } from '@/components/ui/Sheet';
import { showSnackbar } from '@/components/ui/Snackbar';
import { TextField } from '@/components/ui/TextField';
import { CategoryTagPicker } from '@/features/categories/components/CategoryTagPicker';
import { useCategories } from '@/features/categories/hooks';
import { getCurrency } from '@/features/currencies/hooks';
import { AmountDisplay } from '@/features/expenses/components/AmountDisplay';
import { Keypad } from '@/features/expenses/components/Keypad';
import { useSettings } from '@/features/settings/store';
import { formatDate, fromDateKey, toDateKey } from '@/lib/dates';
import { applyKey, inputToMinor, minorToInput } from '@/lib/money';
import type { Schedule } from '@/lib/recurring';

import { deleteRecurring, getRecurring, restoreRecurring, saveRecurring } from '../queries';

/** Create or edit a recurring expense; it is auto-added as an expense on each due date. */
export function RecurringSheet({ recurringId }: { recurringId?: string }) {
  const { t, i18n } = useTranslation();
  const activeCurrency = useSettings((s) => s.currency);
  const categories = useCategories();

  const [existing] = useState(() => (recurringId ? getRecurring(recurringId) : undefined));
  const currency = existing?.currency ?? activeCurrency;
  const [decimals] = useState(() => getCurrency(currency)?.decimals ?? 0);

  const [input, setInput] = useState(() =>
    existing ? minorToInput(existing.amount, decimals) : '',
  );
  const [selection, setSelection] = useState({
    categoryId: existing?.categoryId,
    tagIds: existing?.tagIds ?? [],
  });
  const [schedule, setSchedule] = useState<Schedule>(existing?.schedule ?? 'monthly');
  const [startDate, setStartDate] = useState(existing?.startDate ?? toDateKey(new Date()));
  const [description, setDescription] = useState(existing?.description ?? '');

  const categoryId = selection.categoryId ?? categories[0]?.id;
  const amount = inputToMinor(input, decimals);
  const canSave = amount > 0 && !!categoryId;

  const save = () => {
    if (!canSave) return;
    saveRecurring(
      {
        amount,
        currency,
        categoryId,
        tagIds: selection.tagIds,
        description: description.trim() || null,
        schedule,
        startDate,
      },
      recurringId,
    );
    router.back();
  };

  const remove = () => {
    if (!recurringId) return;
    deleteRecurring(recurringId);
    router.back();
    showSnackbar(t('recurring.deleted'), {
      label: t('common.undo'),
      onPress: () => restoreRecurring(recurringId),
    });
  };

  return (
    <Sheet
      fullHeight
      title={t(existing ? 'recurring.editTitle' : 'recurring.newTitle')}
      right={
        existing ? (
          <IconButton
            Icon={Trash2}
            label={t('recurring.delete')}
            onPress={remove}
            variant="danger"
          />
        ) : (
          <CurrencyBadge code={currency} />
        )
      }
    >
      <AmountDisplay input={input} currency={currency} />

      <CategoryTagPicker
        categoryId={categoryId}
        tagIds={selection.tagIds}
        onChange={(id, tagIds) => setSelection({ categoryId: id, tagIds })}
      />

      <View style={styles.row}>
        <DateField
          value={startDate}
          label={t('recurring.starts', {
            date: formatDate(fromDateKey(startDate), t('dates.dayMonthYear'), i18n.language),
          })}
          onChange={setStartDate}
          // New items start today or later; past occurrences are not back-filled.
          minimumDate={existing ? undefined : new Date()}
        />
        <View style={styles.schedule}>
          <SegmentedControl
            options={[
              { value: 'monthly', label: t('recurring.monthly') },
              { value: 'yearly', label: t('recurring.yearly') },
            ]}
            value={schedule}
            onChange={setSchedule}
          />
        </View>
      </View>
      <TextField
        compact
        value={description}
        onChangeText={setDescription}
        placeholder={t('expense.descriptionPlaceholder')}
      />

      <Keypad
        decimals={decimals}
        onKey={(key) => setInput((value) => applyKey(value, key, decimals))}
      />

      <Button label={t('common.save')} onPress={save} disabled={!canSave} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  schedule: { flex: 1 },
});
