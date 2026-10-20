import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/theme';

import { Text } from './Text';

// Space kept free at the bottom so content can scroll above the floating nav pill.
export const NAV_CLEARANCE = 120;

/** Content padding for tab screens; list screens pass it to their FlatList. */
export function useScreenContentStyle() {
  const insets = useSafeAreaInsets();
  return [
    styles.content,
    { paddingTop: insets.top + 12, paddingBottom: insets.bottom + NAV_CLEARANCE },
  ];
}

type HeaderProps = { title: string; subtitle?: string; right?: ReactNode };

export function ScreenHeader({ title, subtitle, right }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titles}>
        {subtitle ? (
          <Text size={13} muted>
            {subtitle}
          </Text>
        ) : null}
        <Text size={28} weight="bold" style={styles.title}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

export function Screen({ children, ...header }: HeaderProps & { children?: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={useScreenContentStyle()}>
      <ScreenHeader {...header} />
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.screen, gap: spacing.section },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titles: { gap: 2 },
  title: { letterSpacing: -0.56 },
});
