import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/theme';

// Blurred color blobs from the mockups (390×844 artboard), drawn as radial gradients
// because React Native views have no CSS blur filter.
const blobs = [
  { id: 'violet', color: colors.blobs.violet, cx: 60, cy: 100, r: 230, opacity: 0.55 },
  { id: 'teal', color: colors.blobs.teal, cx: 360, cy: 420, r: 210, opacity: 0.45 },
  { id: 'pink', color: colors.blobs.pink, cx: 150, cy: 794, r: 210, opacity: 0.4 },
];

export function GlassBackground() {
  return (
    <Svg
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
    >
      <Defs>
        {blobs.map((b) => (
          <RadialGradient key={b.id} id={b.id}>
            <Stop offset="0" stopColor={b.color} stopOpacity={b.opacity} />
            <Stop offset="0.4" stopColor={b.color} stopOpacity={b.opacity * 0.8} />
            <Stop offset="1" stopColor={b.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {blobs.map((b) => (
        <Circle key={b.id} cx={b.cx} cy={b.cy} r={b.r} fill={`url(#${b.id})`} />
      ))}
    </Svg>
  );
}
