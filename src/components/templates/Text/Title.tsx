/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StyleProp } from 'react-native';

import { Text, View } from 'react-native';

import { useTheme } from '@/theme';

interface TitleProps {
  title: string;
  subtitle: string;
  style?: StyleProp<any>;
}
function Title({ title, subtitle, ...props }: TitleProps) {
  const { fonts, layout, gutters } = useTheme();

  return (
    <View style={[layout.center, gutters.gap_8, props.style]}>
      <Text style={[fonts.text_01, fonts.size_20, fonts.center, fonts.rubikMedium]}>{title}</Text>
      <Text style={[fonts.text_02, fonts.center, fonts.rubikRegular]}>{subtitle}</Text>
    </View>
  );
}

export default Title;
