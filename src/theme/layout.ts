import type { ViewStyle } from 'react-native';

export default {
  col: {
    flexDirection: 'column',
  },
  colReverse: {
    flexDirection: 'column-reverse',
  },
  itemsCenter: {
    alignItems: 'center',
  },
  itemsEnd: {
    alignItems: 'flex-end',
  },
  itemsStart: {
    alignItems: 'flex-start',
  },
  itemsStretch: {
    alignItems: 'stretch',
  },
  justifyAround: {
    justifyContent: 'space-around',
  },
  justifyBetween: {
    justifyContent: 'space-between',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfCenter: {
    alignSelf: 'center',
  },
  /* Sizes Layouts */
  flex_1: {
    flex: 1,
  },
  flex_2: {
    flex: 2,
  },
  flex_3: {
    flex: 3,
  },
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  /* Positions */
  absolute: {
    position: 'absolute',
  },
  bottom0: {
    bottom: 0,
  },
  left0: {
    left: 0,
  },
  relative: {
    position: 'relative',
  },
  right0: {
    right: 0,
  },
  top0: {
    top: 0,
  },
  z1: {
    zIndex: 1,
  },
  z10: {
    zIndex: 10,
  },
  w_20: {
    width: '20%',
  },
  w_25: {
    width: '25%',
  },
  w_30: {
    width: '30%',
  },
  w_50: {
    width: '50%',
  },
  w_60: {
    width: '60%',
  },
  w_70: {
    width: '70%',
  },
  w_75: {
    width: '75%',
  },
  w_80: {
    width: '80%',
  },
  w_90: {
    width: '90%',
  },
  w_100: {
    width: '100%',
  },
  opacity_0: {
    opacity: 0,
  },
  opacity_25: {
    opacity: 0.25,
  },
  opacity_50: {
    opacity: 0.5,
  },
  opacity_75: {
    opacity: 0.75,
  },
  opacity_80: {
    opacity: 0.8,
  },
  opacity_90: {
    opacity: 0.9,
  },
  opacity_100: {
    opacity: 1,
  },
} as const satisfies Record<string, ViewStyle>;
