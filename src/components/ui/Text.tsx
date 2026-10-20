import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = RNTextProps & {
  weight?: keyof typeof fonts;
  size?: number;
  muted?: boolean;
};

export function Text({ weight = 'regular', size = 15, muted, style, ...rest }: Props) {
  return (
    <RNText
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: size,
          color: muted ? colors.textMuted : colors.text,
        },
        style,
      ]}
      {...rest}
    />
  );
}
