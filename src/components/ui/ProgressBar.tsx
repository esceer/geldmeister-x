import { View } from 'react-native';

type Props = { value: number; color: string; height?: number };

/** Horizontal bar; `value` is a 0–1 fraction (clamped). */
export function ProgressBar({ value, color, height = 4 }: Props) {
  const width = `${Math.min(Math.max(value, 0), 1) * 100}%` as const;
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: 'rgba(255,255,255,0.1)' }}>
      <View style={{ width, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}
