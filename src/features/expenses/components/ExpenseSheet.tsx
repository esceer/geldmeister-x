import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { CalendarDays, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Sheet } from '@/components/ui/Sheet';
import { showSnackbar } from '@/components/ui/Snackbar';
import { Text } from '@/components/ui/Text';
import { AddTagChip } from '@/features/categories/components/AddTagChip';
import { useCategories, useTags } from '@/features/categories/hooks';
import { createTag } from '@/features/categories/queries';
import { CategoryIcon, tint } from '@/features/categories/icons';
import { getCurrency } from '@/features/currencies/hooks';
import { useSettings } from '@/features/settings/store';
import { formatDate, fromDateKey, toDateKey } from '@/lib/dates';
import { applyKey, currencySymbol, formatInput, inputToMinor, minorToInput } from '@/lib/money';
import { colors, fonts, radius } from '@/theme';

import { dayLabel } from '../dayLabel';
import { deleteExpense, getExpense, restoreExpense, saveExpense } from '../queries';
import { Keypad } from './Keypad';

type Props = { expenseId?: string };

/** Add / edit expense bottom sheet (design: Add.dc.html, Edit.dc.html). */
export function ExpenseSheet({ expenseId }: Props) {
  const { t, i18n } = useTranslation();
  const activeCurrency = useSettings((s) => s.currency);
  const categories = useCategories();
  const allTags = useTags();

  const [existing] = useState(() => (expenseId ? getExpense(expenseId) : undefined));
  // Editing keeps the expense's own currency.
  const currency = existing?.currency ?? activeCurrency;
  const [decimals] = useState(() => getCurrency(currency)?.decimals ?? 0);

  const [input, setInput] = useState(() =>
    existing ? minorToInput(existing.amount, decimals) : '',
  );
  const [categoryId, setCategoryId] = useState(existing?.categoryId);
  const [tagIds, setTagIds] = useState<string[]>(existing?.tagIds ?? []);
  const [date, setDate] = useState(existing?.date ?? toDateKey(new Date()));
  const [description, setDescription] = useState(existing?.description ?? '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedCategoryId = categoryId ?? categories[0]?.id;
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const categoryTags = allTags.filter((tag) => tag.categoryId === selectedCategoryId);
  const amount = inputToMinor(input, decimals);
  const canSave = amount > 0 && !!selectedCategoryId;

  const close = () => router.back();

  const selectCategory = (id: string) => {
    if (id === selectedCategoryId) return;
    setCategoryId(id);
    setTagIds([]); // tags belong to their category
  };

  const toggleTag = (id: string) =>
    setTagIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const addTag = (name: string) => {
    if (!selectedCategoryId) return;
    const id = createTag(selectedCategoryId, name);
    setTagIds((ids) => [...ids, id]);
  };

  const save = () => {
    if (!canSave) return;
    saveExpense(
      {
        amount,
        currency,
        categoryId: selectedCategoryId,
        tagIds,
        date,
        description: description.trim() || null,
      },
      expenseId,
    );
    close();
  };

  const remove = () => {
    if (!expenseId) return;
    deleteExpense(expenseId);
    close();
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
          <View style={styles.currencyChip}>
            <Text size={14} weight="semibold">
              {currency}
            </Text>
          </View>
        )
      }
    >
      <View style={styles.amount}>
        <View style={styles.amountRow}>
          <Text
            size={52}
            weight="bold"
            style={styles.amountText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatInput(input, i18n.language)}
          </Text>
          <Text size={22} weight="semibold" muted>
            {currencySymbol(currency)}
          </Text>
        </View>
        {existing ? (
          <Text size={12} muted>
            {t('expense.added', {
              currency,
              date: formatDate(existing.createdAt, t('dates.weekdayDayMonth'), i18n.language),
            })}
          </Text>
        ) : null}
      </View>

      <View style={styles.categories}>
        {categories.map((category) => {
          const selected = category.id === selectedCategoryId;
          return (
            <Pressable
              key={category.id}
              onPress={() => selectCategory(category.id)}
              accessibilityState={{ selected }}
              style={[
                styles.category,
                selected && {
                  backgroundColor: tint(category.color, 0.2),
                  borderColor: category.color,
                },
              ]}
            >
              <CategoryIcon
                icon={category.icon}
                size={16}
                color={category.color}
                strokeWidth={1.8}
              />
              <Text size={13} weight={selected ? 'semibold' : 'medium'} numberOfLines={1}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.tags}>
        {categoryTags.map((tag) => {
          const selected = tagIds.includes(tag.id);
          return (
            <Pressable
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              accessibilityState={{ selected }}
              style={[styles.tag, selected && { backgroundColor: selectedCategory?.color }]}
            >
              <Text
                size={13}
                weight={selected ? 'semibold' : 'medium'}
                style={selected && { color: colors.onAccent }}
              >
                # {tag.name}
              </Text>
            </Pressable>
          );
        })}
        <AddTagChip onAdd={addTag} />
      </View>

      <View style={styles.detailsRow}>
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.field}>
          <CalendarDays size={16} color={colors.text} strokeWidth={1.8} />
          <Text size={13} weight="medium">
            {dayLabel(date, ', ', t, i18n.language)}
          </Text>
        </Pressable>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder={t('expense.descriptionPlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={[styles.field, styles.description]}
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

      {showDatePicker ? (
        <DateTimePicker
          value={fromDateKey(date)}
          mode="date"
          maximumDate={new Date()}
          onChange={(event, value) => {
            setShowDatePicker(false);
            if (event.type === 'set' && value) setDate(toDateKey(value));
          }}
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  currencyChip: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: colors.navBorder,
  },
  amount: { alignItems: 'center', gap: 2, paddingVertical: 6 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  amountText: { letterSpacing: -1.5, flexShrink: 1 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  category: {
    flexGrow: 1,
    flexBasis: '30%',
    height: 44,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radius.chip,
    justifyContent: 'center',
    backgroundColor: colors.chip,
  },
  detailsRow: { flexDirection: 'row', gap: 8 },
  field: {
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  description: {
    flex: 1,
    paddingVertical: 0,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
});
