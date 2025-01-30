import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { ComponentTheme } from '@/theme/types/theme';

import { Dimensions } from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AllStyle extends Record<string, AllStyle | ImageStyle | TextStyle | ViewStyle> {}

const WINDOW_WIDTH = Dimensions.get('window').width;

export default ({ backgrounds, borders, colors, gutters, fonts, layout, variant }: ComponentTheme) => {
  return {
    buttonCircle: {
      ...layout.justifyCenter,
      ...layout.itemsCenter,
      ...backgrounds.purple100,
      ...fonts.gray400,
      borderRadius: 35,
      height: 64,
      width: 64,
    },
    circle250: {
      borderRadius: 140,
      height: 250,
      width: 250,
    },
    screen: {
      ...layout.flex_1,
      ...layout.fullWidth,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      backgroundColor: colors.ui_background,
    },
    searchBar: {
      ...borders.rounded_16,
      ...fonts.rubikRegular,
      backgroundColor: colors.ui_01,
      color: colors.text_01,
      paddingVertical: 12,
      paddingHorizontal: 36,
      height: 44,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    textInput: {
      ...borders.rounded_8,
      ...layout.w_80,
      color: colors.text_01,
      backgroundColor: colors.ui_01,
      paddingVertical: 12,
      paddingHorizontal: 8,
      height: 44,
      textAlign: 'left',
      textAlignVertical: 'center',
    },
    textArea: {
      ...borders.rounded_8,
      ...layout.w_80,
      color: colors.text_01,
      backgroundColor: colors.ui_01,
      padding: 12,
      height: 88,
      textAlign: 'left',
      textAlignVertical: 'center',
    },
    avatar: {
      ...borders.w_1,
      ...borders.rounded_24,
      borderColor: colors.border_02,
      height: 48,
      width: 48,
    },
    button: {
      ...layout.center,
      ...borders.rounded_8,
      height: 44,
      backgroundColor: variant === 'dark' ? colors.interactive_01 : colors.ui_03,
    },
    buttonText: {
      ...fonts.center,
      ...fonts.rubikMedium,
      color: colors.white,
      overflow: 'hidden',
    },
    handle: {
      backgroundColor: colors.text_01,
      borderRadius: 32,
      opacity: 0.75,
      width: 28,
      height: 6,
    },
    indicator: {
      alignSelf: 'center',
      width: (7.5 * WINDOW_WIDTH) / 100,
      height: 4,
      borderRadius: 4,
      backgroundColor: colors.text_02,
    },
    base: {
      ...layout.center,
      ...borders.rounded_8,
      backgroundColor: colors.ui_01,
    },
    card: {
      ...borders.rounded_8,
      ...gutters.padding_8,
      borderWidth: 1,
      borderColor: colors.ui_01,
      backgroundColor: colors.ui_background,
    },
  } as const satisfies AllStyle;
};
