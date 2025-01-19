import type { LinkingOptions, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Example, Startup } from '@/screens';

import { storage } from '@/services/mmkv';

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerRef = useRef<NavigationContainerRef<any>>(null);
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
    const currentRouteName = containerRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      // Replace the line below to add the tracker from a mobile analytics SDK
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
    routeNameRef.current = containerRef.current?.getCurrentRoute()?.name;
    navigationIntegration.registerNavigationContainer(containerRef);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={containerRef}
        theme={navigationTheme}
        linking={linking}
        onReady={onReady}
        onStateChange={onStateChange}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Example} name={Paths.Onboarding} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
