import type { BottomSheetNavigationEventMap, BottomSheetNavigationOptions } from './types';
import type {
  EventArg,
  NavigatorTypeBagBase,
  ParamListBase,
  StackActionHelpers,
  StackNavigationState,
  StackRouterOptions,
  StaticConfig,
  TypedNavigator,
} from '@react-navigation/native';
import type {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigationProp,
  StackNavigatorProps,
} from '@react-navigation/stack';

import { createNavigatorFactory, StackActions, StackRouter, useNavigationBuilder } from '@react-navigation/native';
import * as React from 'react';

import BottomSheetNavigatorView from './views/BottomSheetNavigatorView';

function BottomSheetNavigator({
  id,
  initialRouteName,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_getStateForRouteNamesChange,
  ...rest
}: StackNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions | BottomSheetNavigationOptions,
    StackNavigationEventMap | BottomSheetNavigationEventMap
  >(StackRouter, {
    id,
    initialRouteName,
    children,
    // @ts-expect-error: this is fine
    layout,
    screenListeners,
    screenOptions,
    screenLayout,
    UNSTABLE_getStateForRouteNamesChange,
  });

  React.useEffect(
    () =>
      // @ts-expect-error we're missing this event handler in our custom
      // bottom-sheet types
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (state.index > 0 && isFocused && !(e as EventArg<'tabPress', true>).defaultPrevented) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key],
  );

  return (
    <NavigationContent>
      <BottomSheetNavigatorView {...rest} descriptors={descriptors} navigation={navigation} state={state} />
    </NavigationContent>
  );
}

export function createBottomSheetNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = undefined,
  const TypeBag extends NavigatorTypeBagBase = {
    ParamList: ParamList;
    NavigatorID: NavigatorID;
    State: StackNavigationState<ParamList>;
    ScreenOptions: StackNavigationOptions | BottomSheetNavigationOptions;
    EventMap: StackNavigationEventMap | BottomSheetNavigationEventMap;
    NavigationList: {
      [RouteName in keyof ParamList]: StackNavigationProp<ParamList, RouteName, NavigatorID>;
    };
    Navigator: typeof BottomSheetNavigator;
  },
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(BottomSheetNavigator)(config);
}
