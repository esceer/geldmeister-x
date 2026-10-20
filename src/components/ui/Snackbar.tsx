import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

import { colors } from '@/theme';

import { Text } from './Text';

const DURATION_MS = 5000;

type Snack = { id: number; message: string; action?: { label: string; onPress: () => void } };

const useSnackbarStore = create<{ snack: Snack | null }>(() => ({ snack: null }));

export function showSnackbar(message: string, action?: Snack['action']) {
  useSnackbarStore.setState({ snack: { id: Date.now(), message, action } });
}

const hide = () => useSnackbarStore.setState({ snack: null });

/** Global snackbar, rendered once in the root layout above the nav pill. */
export function Snackbar() {
  const snack = useSnackbarStore((s) => s.snack);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!snack) return;
    const timer = setTimeout(hide, DURATION_MS);
    return () => clearTimeout(timer);
  }, [snack]);

  if (!snack) return null;

  return (
    <Animated.View
      key={snack.id}
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[styles.bar, { bottom: insets.bottom + 108 }]}
    >
      <Text style={styles.message}>{snack.message}</Text>
      {snack.action ? (
        <Pressable
          hitSlop={12}
          onPress={() => {
            snack.action?.onPress();
            hide();
          }}
        >
          <Text weight="semibold" style={{ color: colors.link }}>
            {snack.action.label}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    minHeight: 52,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.navBorder,
    backgroundColor: 'rgba(36,38,60,0.96)',
  },
  message: { flex: 1 },
});
