import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import {
  ChartPie,
  House,
  List,
  Plus,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react-native';
import type { ComponentRef, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/Text';
import { colors, radius } from '@/theme';

type Tab = { href: '/' | '/expenses' | '/reports' | '/settings'; label: string; Icon: LucideIcon };

type Props = { blurTarget: RefObject<ComponentRef<typeof View> | null> };

// Floating glass nav pill: Home · Expenses · (+) · Reports · Settings
export function TabBar({ blurTarget }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const tabs: Tab[] = [
    { href: '/', label: t('tabs.home'), Icon: House },
    { href: '/expenses', label: t('tabs.expenses'), Icon: List },
    { href: '/reports', label: t('tabs.reports'), Icon: ChartPie },
    { href: '/settings', label: t('tabs.settings'), Icon: SlidersHorizontal },
  ];

  const renderTab = ({ href, label, Icon }: Tab) => {
    const active = pathname === href;
    const color = active ? colors.textActive : colors.textMuted;
    return (
      <Pressable
        key={href}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onPress={() => router.navigate(href)}
        style={styles.tab}
      >
        <Icon size={22} color={color} strokeWidth={1.8} />
        <Text size={11} weight={active ? 'semibold' : 'regular'} style={{ color }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <BlurView
      blurTarget={blurTarget}
      blurMethod="dimezisBlurViewSdk31Plus"
      intensity={28}
      tint="dark"
      style={[styles.pill, { bottom: insets.bottom + 24 }]}
    >
      {tabs.slice(0, 2).map(renderTab)}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('add.title')}
        onPress={() => router.push('/add')}
        style={styles.fab}
      >
        <Plus size={26} color={colors.onAccent} strokeWidth={2.4} />
      </Pressable>
      {tabs.slice(2).map(renderTab)}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 68,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: radius.nav,
    borderWidth: 1,
    borderColor: colors.navBorder,
    backgroundColor: colors.nav,
    overflow: 'hidden',
  },
  tab: { width: 64, alignItems: 'center', gap: 3 },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
