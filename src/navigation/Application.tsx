import type { LinkingOptions, NavigationState } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';

import { useTheme } from '@/theme';
import { createBottomSheetNavigator } from '@/navigation/bottom-sheet';
import { Paths } from '@/navigation/paths';

import { CreateWallet, Example, Onboarding, Startup, Welcome } from '@/screens';

import { storage } from '@/services/mmkv';

import { navigationRef } from './navigationRef';

const Stack = createStackNavigator<RootStackParamList>();
const BSStack = createBottomSheetNavigator();

function ApplicationNavigator() {
  const routeNameRef = useRef<string | undefined>(undefined);
  const { navigationTheme, variant } = useTheme();
  const onboarding = storage.getBoolean('onboarding');
  const initialized = storage.getBoolean('initialized');

  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [
      'wc://',
      'rely://',
      'wallet://',
      'ethereum://',
      'solana://',
      'bitcoin://',
      'mina://',
      'https://getrely.io',
      'https://*.getrely.io',
      'https://craftlabs.tech',
      'https://*.craftlabs.tech',
    ],
    config: {
      screens: {
        root: 'root',
      },
    },
  };

  const initialRouteName = (!onboarding ? 'onboarding' : !initialized ? 'welcome' : 'root') as never;

  const onStateChange = (state: NavigationState | undefined) => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      // TODO: Replace the line below to add the tracker from a mobile analytics SDK
      console.log('Navigation state changed:', state); // eslint-disable-line no-console
    }

    // Save the current route name for later comparison
    routeNameRef.current = currentRouteName;
  };

  const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
  });

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [navigationIntegration],
    // uncomment the line below to enable Spotlight (https://spotlightjs.com)
    spotlight: __DEV__,
  });

  const onReady = () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    navigationIntegration.registerNavigationContainer(navigationRef);
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      linking={linking}
      onReady={onReady}
      onStateChange={onStateChange}>
      <Stack.Navigator key={variant} screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
        <Stack.Screen component={Startup} name={Paths.Startup} />
        <Stack.Screen component={Onboarding} name={Paths.Onboarding} />
        <Stack.Screen component={WalletNavigator} name={Paths.Welcome} options={{ gestureEnabled: false }} />
        <Stack.Screen component={Example} name={Paths.Example} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function WalletNavigator() {
  const { height } = useWindowDimensions();

  return (
    <BSStack.Navigator screenOptions={{ headerShown: false }}>
      <BSStack.Screen component={Welcome} name="home" />
      <BSStack.Screen
        component={CreateWallet}
        name="createWallet"
        options={{ height: height * 0.5, backdropOpacity: 0.75 }}
      />
      <BSStack.Screen component={Example} name="importWallet" />
      <BSStack.Screen component={Example} name="setPassword" />
    </BSStack.Navigator>
  );
}

export default ApplicationNavigator;
