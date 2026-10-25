import { router } from 'expo-router';
import { Repeat, Trash2 } from 'lucide-react-native';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

import { showSnackbar } from '@/components/ui/Snackbar';
import { Text } from '@/components/ui/Text';
import { CategoryIcon, tint } from '@/features/categories/icons';
import { formatDate, fromDateKey, relativeDay } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import { colors } from '@/theme';

import type { ExpenseListItem } from '../hooks';
import { deleteExpense, restoreExpense } from '../queries';

type Props = {
  item: ExpenseListItem;
  currency: string;
  decimals: number;
  divider: boolean;
  showDay?: boolean; // adds "Today" / "19 Oct" to the subtitle (Home's recent list)
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Tap to edit, swipe left to delete (after confirming, with undo). */
export function ExpenseRow({ item, currency, decimals, divider, showDay }: Props) {
  const { t, i18n } = useTranslation();
  const title = item.tagNames ? capitalize(item.tagNames) : item.categoryName;
  const day = showDay ? relativeDay(item.date) : null;
  const dayText = day
    ? t(`common.${day}`)
    : formatDate(fromDateKey(item.date), t('dates.dayMonth'), i18n.language);
  const subtitle = [item.categoryName, showDay && dayText, item.description]
    .filter(Boolean)
    .join(' · ');

  const swipeable = useRef<SwipeableMethods>(null);
  const close = () => swipeable.current?.close();

  const remove = () => {
    deleteExpense(item.id);
    showSnackbar(t('expense.deleted'), {
      label: t('common.undo'),
      onPress: () => restoreExpense(item.id),
    });
  };

  const confirmRemove = () =>
    Alert.alert(
      t('expense.deleteTitle'),
      t('expense.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel', onPress: close },
        { text: t('common.delete'), style: 'destructive', onPress: remove },
      ],
      { cancelable: true, onDismiss: close },
    );

  return (
    <Swipeable
      ref={swipeable}
      friction={2}
      rightThreshold={80}
      overshootRight={false}
      onSwipeableOpen={confirmRemove}
      renderRightActions={(progress) => <DeleteAction progress={progress} />}
    >
      <Pressable
        onPress={() => router.push({ pathname: '/expense', params: { id: item.id } })}
        style={[styles.row, divider && styles.divider]}
      >
        <View style={[styles.icon, { backgroundColor: tint(item.categoryColor) }]}>
          <CategoryIcon
            icon={item.categoryIcon}
            size={20}
            color={item.categoryColor}
            strokeWidth={1.8}
          />
        </View>
        <View style={styles.texts}>
          <Text weight="semibold" numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.subtitle}>
            <Text size={12} muted numberOfLines={1} style={styles.shrink}>
              {item.schedule ? `${subtitle} ·` : subtitle}
            </Text>
            {item.schedule ? (
              <>
                <Repeat size={12} color={colors.textMuted} strokeWidth={1.8} />
                <Text size={12} muted>
                  {t(`recurring.${item.schedule}`)}
                </Text>
              </>
            ) : null}
          </View>
        </View>
        <Text weight="semibold">{formatMoney(item.amount, currency, decimals, i18n.language)}</Text>
      </Pressable>
    </Swipeable>
  );
}

// Rows are translucent, so the action fades in with the swipe instead of showing through.
function DeleteAction({ progress }: { progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({ opacity: progress.value }));
  return (
    <Animated.View style={[styles.deleteAction, style]}>
      <Trash2 size={20} color={colors.dangerText} strokeWidth={1.8} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, gap: 2 },
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shrink: { flexShrink: 1 },
  deleteAction: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,90,90,0.18)',
  },
});
