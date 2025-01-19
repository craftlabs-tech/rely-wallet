import type { TextStyle } from 'react-native';
import type { UnionConfiguration } from '@/theme/types/config';
import type { FontColors, FontSizes } from '@/theme/types/fonts';

import { config } from '@/theme/_config';

export const generateFontColors = (configuration: UnionConfiguration) => {
  return Object.entries(configuration.fonts.colors ?? {}).reduce((acc, [key, value]) => {
    return Object.assign(acc, {
      [`${key}`]: {
        color: value,
      },
    });
  }, {} as FontColors);
};

export const generateFontSizes = () => {
  return config.fonts.sizes.reduce((acc, size) => {
    return Object.assign(acc, {
      [`size_${size}`]: {
        fontSize: size,
      },
    });
  }, {} as FontSizes);
};

export const staticFontStyles = {
  alignCenter: {
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  rubikBlack: {
    fontFamily: 'Rubik-Black',
  },
  rubikBlackItalic: {
    fontFamily: 'Rubik-BlackItalic',
  },
  rubikBold: {
    fontFamily: 'Rubik-Bold',
  },
  rubikBoldItalic: {
    fontFamily: 'Rubik-BoldItalic',
  },
  rubikExtraBold: {
    fontFamily: 'Rubik-ExtraBold',
  },
  rubikExtraBoldItalic: {
    fontFamily: 'Rubik-ExtraBoldItalic',
  },
  rubikItalic: {
    fontFamily: 'Rubik-Italic',
  },
  rubikLight: {
    fontFamily: 'Rubik-Light',
  },
  rubikLightItalic: {
    fontFamily: 'Rubik-LightItalic',
  },
  rubikMedium: {
    fontFamily: 'Rubik-Medium',
  },
  rubikMediumItalic: {
    fontFamily: 'Rubik-MediumItalic',
  },
  rubikRegular: {
    fontFamily: 'Rubik-Regular',
  },
  rubikSemiBold: {
    fontFamily: 'Rubik-SemiBold',
  },
  rubikSemiBoldItalic: {
    fontFamily: 'Rubik-SemiBoldItalic',
  },
} as const satisfies Record<string, TextStyle>;
