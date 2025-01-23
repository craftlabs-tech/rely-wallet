import type { LinkingOptions, NavigationState } from '@react-navigation/native';
import type { ReactNode } from 'react';
import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import React, { useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme';
import { createBottomSheetNavigator } from '@/navigation/bottom-sheet';
import { navigationRef } from '@/navigation/navigationRef';
import { Paths } from '@/navigation/paths';

import {
  CreateWallet,
  Example,
  ImportWallet,
  Login,
  Onboarding,
  Reset,
  SetPassword,
  Startup,
  Welcome,
} from '@/screens';

import { initSentry } from '@/services/logger/sentry';
import { storage } from '@/services/mmkv';

const Stack = createStackNavigator<RootStackParamList>();
const BSStack = createBottomSheetNavigator<RootStackParamList>();

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

  const initialRouteName = !onboarding ? Paths.Onboarding : !initialized ? Paths.Welcome : Paths.Auth;

  const navigationIntegration = Sentry.reactNavigationIntegration({ enableTimeToInitialDisplay: true });

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

  const onReady = () => {
    routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
    navigationIntegration.registerNavigationContainer(navigationRef);
    initSentry(navigationIntegration);
  };

  return (
    <ToastProvider>
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
          <Stack.Screen component={AuthNavigator} name={Paths.Auth} options={{ gestureEnabled: false }} />
          <Stack.Screen component={Example} name={Paths.Root} />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}

function AuthNavigator() {
  const { height } = useWindowDimensions();

  return (
    <BSStack.Navigator>
      <BSStack.Screen component={Login} name={Paths.Login} />
      <BSStack.Screen component={Reset} name={Paths.Reset} options={{ height: height * 0.4 }} />
    </BSStack.Navigator>
  );
}

function WalletNavigator() {
  const { height } = useWindowDimensions();

  return (
    <BSStack.Navigator screenOptions={{ headerShown: false }}>
      <BSStack.Screen component={Welcome} name={Paths.Home} />
      <BSStack.Screen component={CreateWallet} name={Paths.CreateWallet} options={{ height: height * 0.5 }} />
      <BSStack.Screen component={ImportWallet} name={Paths.ImportWallet} options={{ height: height * 0.5 }} />
      <BSStack.Screen component={SetPassword} name={Paths.SetPassword} options={{ height: height * 0.5 }} />
    </BSStack.Navigator>
  );
}

function ToastProvider({ children }: { children: ReactNode }) {
  const { top } = useSafeAreaInsets();

  return (
    <>
      {children}
      <Toast topOffset={top * 1.6} />
    </>
  );
}

export default ApplicationNavigator;
