import { router } from 'expo-router';
import { useRef, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import type { Tag } from '@/db/schema';

import { tint } from '../icons';
import { reorderTags } from '../queries';

type Props = { tags: Tag[]; color: string; children?: ReactNode };

/** A category's tag chips; tap to rename or delete, long-press and drag to reorder. */
export function TagChips({ tags, color, children }: Props) {
  // Chip frames within the wrap, to find the drop target.
  const layouts = useRef(new Map<string, LayoutRectangle>());

  const drop = (tagId: string, dx: number, dy: number) => {
    const from = layouts.current.get(tagId);
    if (!from) return;
    const x = from.x + from.width / 2 + dx;
    const y = from.y + from.height / 2 + dy;
    const distance = (tag: Tag) => {
      const l = layouts.current.get(tag.id);
      return l ? Math.hypot(l.x + l.width / 2 - x, l.y + l.height / 2 - y) : Infinity;
    };
    const target = tags.reduce((best, tag) => (distance(tag) < distance(best) ? tag : best));
    if (target.id === tagId) return;
    const ids = tags.map((tag) => tag.id).filter((id) => id !== tagId);
    ids.splice(tags.indexOf(target), 0, tagId);
    reorderTags(ids);
  };

  return (
    <View style={styles.tags}>
      {tags.map((tag) => (
        <TagChip
          key={tag.id}
          tag={tag}
          color={color}
          onLayout={(layout) => layouts.current.set(tag.id, layout)}
          onDrop={(dx, dy) => drop(tag.id, dx, dy)}
        />
      ))}
      {children}
    </View>
  );
}

type ChipProps = {
  tag: Tag;
  color: string;
  onLayout: (layout: LayoutRectangle) => void;
  onDrop: (dx: number, dy: number) => void;
};

function TagChip({ tag, color, onLayout, onDrop }: ChipProps) {
  const dx = useSharedValue(0);
  const dy = useSharedValue(0);
  const dragging = useSharedValue(false);

  const pan = usePanGesture({
    activateAfterLongPress: 300,
    runOnJS: true,
    onActivate: () => {
      dragging.value = true;
    },
    onUpdate: (e) => {
      dx.value = e.translationX;
      dy.value = e.translationY;
    },
    onDeactivate: (e) => {
      onDrop(e.translationX, e.translationY);
    },
    onFinalize: () => {
      dragging.value = false;
      dx.value = 0;
      dy.value = 0;
    },
  });

  const style = useAnimatedStyle(() => ({
    zIndex: dragging.value ? 1 : 0,
    opacity: dragging.value ? 0.85 : 1,
    transform: [
      { translateX: dx.value },
      { translateY: dy.value },
      { scale: dragging.value ? 1.08 : 1 },
    ],
  }));

  return (
    // Outermost so onLayout is relative to the wrap (the detector adds its own view).
    <Animated.View style={style} onLayout={(e) => onLayout(e.nativeEvent.layout)}>
      <GestureDetector gesture={pan}>
        <Pressable
          onPress={() => router.push({ pathname: '/tag', params: { id: tag.id } })}
          style={[styles.tag, { backgroundColor: tint(color, 0.14) }]}
        >
          <Text size={13} style={{ color }}>
            # {tag.name}
          </Text>
        </Pressable>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { height: 30, paddingHorizontal: 10, borderRadius: 15, justifyContent: 'center' },
});
