import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 4; // gap between segments, in px of arc

type Props = { segments: { value: number; color: string }[]; size?: number; children?: ReactNode };

/** Ring chart with a centered label; zero or negative segments (net refunds) are left out. */
export function Donut({ segments: all, size = 112, children }: Props) {
  const segments = all.filter((s) => s.value > 0);
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let offset = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <G rotation={-90} origin="60, 60" fill="none" strokeWidth={12}>
          <Circle cx={60} cy={60} r={RADIUS} stroke="rgba(255,255,255,0.08)" />
          {total > 0 &&
            segments.map((segment, i) => {
              const length = (segment.value / total) * CIRCUMFERENCE;
              const dash = Math.max(length - (segments.length > 1 ? GAP : 0), 0);
              const circle = (
                <Circle
                  key={i}
                  cx={60}
                  cy={60}
                  r={RADIUS}
                  stroke={segment.color}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += length;
              return circle;
            })}
        </G>
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
