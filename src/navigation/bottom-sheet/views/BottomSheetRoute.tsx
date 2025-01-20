import type { BottomSheetDescriptor } from '../types';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import type { StyleProp, ViewStyle } from 'react-native';
import type { WithSpringConfig } from 'react-native-reanimated';

import BottomSheet, { BottomSheetBackdrop, BottomSheetView, useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard, Platform } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';

import { CONTAINER_HEIGHT, DEFAULT_BACKDROP_COLOR, DEFAULT_BACKDROP_OPACITY, DEFAULT_HEIGHT } from '../constants';
import { BottomSheetNavigatorContext } from '../contexts/internal';

const IS_ANDROID = Platform.OS === 'android';

interface Props {
  routeKey: string;
  descriptor: BottomSheetDescriptor;
  removing?: boolean;
  onDismiss: (key: string, removed: boolean) => void;
}

const BottomSheetRoute = ({
  routeKey,
  descriptor: { options, render, navigation },
  onDismiss,
  removing = false,
}: Props) => {
  // #region extract options
  const {
    enableContentPanningGesture,
    enableHandlePanningGesture,
    index = 0,
    snapPoints = [],
    backdropColor = DEFAULT_BACKDROP_COLOR,
    backdropOpacity = DEFAULT_BACKDROP_OPACITY,
    backdropComponent = null,
    backdropPressBehavior = 'close',
    height = DEFAULT_HEIGHT,
    offsetY = IS_ANDROID ? 20 : 3,
    animationConfig,
  } = options || {};
  // #endregion

  // #region refs
  const ref = useRef<BottomSheet>(null);

  const removingRef = useRef(false);
  removingRef.current = removing;

  // const
  // #endregion

  // #region styles
  // @ts-ignore type mismatch
  const screenContainerStyle: ViewStyle = useMemo(
    () => ({
      bottom: 0,
      height,
      position: 'absolute',
      width: '100%',
    }),
    [height],
  );

  const backdropStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      backgroundColor: backdropColor,
    }),
    [backdropColor],
  );
  // #endregion

  // #region context methods
  const handleSettingSnapPoints = useCallback(
    (_snapPoints: (string | number)[]) => {
      navigation.setOptions({ snapPoints: _snapPoints });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSettingEnableContentPanningGesture = useCallback(
    (value: boolean) => {
      navigation.setOptions({ enableContentPanningGesture: value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleSettingEnableHandlePanningGesture = useCallback(
    (value: boolean) => {
      navigation.setOptions({ enableHandlePanningGesture: value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const contextVariables = useMemo(
    () => ({
      setEnableContentPanningGesture: handleSettingEnableContentPanningGesture,
      setEnableHandlePanningGesture: handleSettingEnableHandlePanningGesture,
      setSnapPoints: handleSettingSnapPoints,
    }),
    [handleSettingEnableContentPanningGesture, handleSettingEnableHandlePanningGesture, handleSettingSnapPoints],
  );
  // #endregion

  // #region callbacks
  const handleOnClose = useCallback(() => {
    onDismiss(routeKey, removingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  // #region effects
  useEffect(() => {
    if (removing === true && ref.current) {
      // close keyboard before closing the modal
      if (Keyboard.isVisible() && IS_ANDROID) {
        Keyboard.dismiss();

        ref.current.close();
      } else {
        ref.current.close();
      }
    }
  }, [removing]);
  // #endregion

  // #region renders
  const renderBackdropComponent = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        // @ts-ignore
        animatedIndex={{ value: 1 }}
        opacity={backdropOpacity}
        style={backdropStyle}
        pressBehavior={backdropPressBehavior}
        {...props}
      />
    ),
    [backdropOpacity, backdropPressBehavior, backdropStyle],
  );

  const animationConfigs = useBottomSheetSpringConfigs({
    mass: 1,
    damping: 30,
    stiffness: 360,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
    ...(animationConfig as WithSpringConfig),
  });

  return (
    <BottomSheetNavigatorContext.Provider value={contextVariables}>
      <BottomSheet
        ref={ref}
        index={index}
        enableDynamicSizing={true}
        maxDynamicContentSize={height}
        containerStyle={{ zIndex: 1 }}
        activeOffsetY={[-offsetY, offsetY]}
        snapPoints={snapPoints}
        enableOverDrag={true}
        overDragResistanceFactor={2.5}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        animateOnMount
        enablePanDownToClose
        onClose={handleOnClose}
        backdropComponent={backdropComponent || renderBackdropComponent}
        animationConfigs={animationConfigs}
        containerHeight={CONTAINER_HEIGHT}
        backgroundComponent={null}
        handleComponent={null}>
        <BottomSheetView style={screenContainerStyle}>{render()}</BottomSheetView>
      </BottomSheet>
    </BottomSheetNavigatorContext.Provider>
  );
};

export default BottomSheetRoute;
