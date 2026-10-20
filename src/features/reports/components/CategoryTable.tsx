import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import type { Category } from '@/db/schema';
import { formatAmount } from '@/lib/money';
import { colors } from '@/theme';

type Props = {
  categories: Category[];
  categoryTotals: { categoryId: string; total: number }[];
  tagTotals: { tagId: string; categoryId: string; name: string; total: number }[];
  decimals: number;
};

/** Category | Amount | Share table, expandable to tag totals; laid out for copying into Excel. */
export function CategoryTable({ categories, categoryTotals, tagTotals, decimals }: Props) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const total = categoryTotals.reduce((sum, r) => sum + r.total, 0);
  const amount = (minor: number) => formatAmount(minor, decimals, i18n.language);
  const share = new Intl.NumberFormat(i18n.language, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const rows = categoryTotals
    .map((r) => ({ ...r, category: categories.find((c) => c.id === r.categoryId) }))
    .sort((a, b) => b.total - a.total);

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text size={11} weight="semibold" muted style={[styles.header, styles.name]}>
          {t('reports.category')}
        </Text>
        <Text size={11} weight="semibold" muted style={[styles.header, styles.amount]}>
          {t('reports.amount')}
        </Text>
        <Text size={11} weight="semibold" muted style={[styles.header, styles.share]}>
          {t('reports.share')}
        </Text>
      </View>
      {rows.length === 0 ? (
        <Text size={13} muted style={styles.empty}>
          {t('reports.empty')}
        </Text>
      ) : null}
      {rows.map(({ categoryId, total: value, category }) => {
        const tags = tagTotals.filter((tag) => tag.categoryId === categoryId);
        const open = expanded.has(categoryId);
        const Chevron = open ? ChevronDown : ChevronRight;
        return (
          <View key={categoryId} style={styles.group}>
            <Pressable
              disabled={tags.length === 0}
              onPress={() => toggle(categoryId)}
              accessibilityState={{ expanded: open }}
              style={styles.row}
            >
              <View style={[styles.name, styles.nameCell]}>
                <Chevron
                  size={16}
                  color={tags.length ? colors.textMuted : 'transparent'}
                  strokeWidth={2}
                />
                <View style={[styles.dot, { backgroundColor: category?.color }]} />
                <Text size={14} weight="semibold" numberOfLines={1} style={styles.shrink}>
                  {category?.name}
                </Text>
              </View>
              <Text size={14} weight="semibold" style={styles.amount}>
                {amount(value)}
              </Text>
              <Text size={14} weight="semibold" style={styles.share}>
                {share.format(value / total)}
              </Text>
            </Pressable>
            {open
              ? tags.map((tag) => (
                  <View key={tag.tagId} style={styles.tagRow}>
                    <Text size={13} style={[styles.name, styles.tagName]} numberOfLines={1}>
                      # {tag.name}
                    </Text>
                    <Text size={13} style={[styles.amount, styles.tagText]}>
                      {amount(tag.total)}
                    </Text>
                    <View style={styles.share} />
                  </View>
                ))
              : null}
          </View>
        );
      })}
    </Card>
  );
}

const tagColor = 'rgba(235,237,250,0.75)';

const styles = StyleSheet.create({
  card: { paddingVertical: 8, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', paddingVertical: 6 },
  header: { textTransform: 'uppercase', letterSpacing: 0.66 },
  group: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  tagRow: { flexDirection: 'row', alignItems: 'center', height: 28 },
  name: { flex: 1 },
  nameCell: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { width: 96, textAlign: 'right' },
  share: { width: 68, textAlign: 'right' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  shrink: { flexShrink: 1 },
  tagName: { paddingLeft: 40, color: tagColor },
  tagText: { color: tagColor },
  empty: { paddingVertical: 16, textAlign: 'center' },
});
