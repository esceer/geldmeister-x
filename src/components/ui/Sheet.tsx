import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

type Props = {
  title: string;
  right?: ReactNode;
  fullHeight?: boolean;
  children: ReactNode;
};

/** Bottom sheet for transparent-modal routes; closing pops the route. */
export function Sheet({ title, right, fullHeight, children }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const close = () => router.back();

  return (
    // Full-height sheets keep their text fields above the keyboard; shrinking them would squash the keypad.
    <KeyboardAvoidingView behavior="padding" enabled={!fullHeight} style={styles.root}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={close}
        accessibilityLabel={t('common.close')}
      />
      <Animated.View
        entering={SlideInDown.duration(260)}
        style={[
          styles.sheet,
          fullHeight ? { flex: 1, marginTop: insets.top } : { maxHeight: '90%' },
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <IconButton Icon={X} label={t('common.close')} onPress={close} />
          <Text size={17} weight="semibold" numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {right ?? <View style={styles.spacer} />}
        </View>
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // In-flow (not absolute) so the keyboard-avoiding padding lifts the sheet.
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.scrim },
  sheet: {
    paddingTop: 10,
    paddingHorizontal: 20,
    gap: 14,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    borderTopWidth: 1,
    borderColor: colors.sheetBorder,
    backgroundColor: colors.sheet,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  title: { flexShrink: 1 },
  spacer: { width: 40 },
});
