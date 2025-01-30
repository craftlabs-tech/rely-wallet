import type { LinkingOptions, NavigationState } from '@react-navigation/native';
import type { ReactNode } from 'react';
import type { RootStackParamList } from '@/navigation/types';

import { BlurView } from '@react-native-community/blur';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import React, { memo, useCallback, useRef } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/theme';
import { createBottomSheetNavigator } from '@/navigation/bottom-sheet';
import { navigationRef } from '@/navigation/navigationRef';
import { Paths } from '@/navigation/paths';
import { TabNavigator } from '@/navigation/TabNavigator';

import {
  CreateWallet,
  Example,
  ImportWallet,
  Login,
  Onboarding,
  Reset,
  Scan,
  SessionProposal,
  SessionRequest,
  Sessions,
  SetPassword,
  Startup,
  Welcome,
} from '@/screens';

import { initSentry } from '@/services/logger/sentry';
import { storage } from '@/services/mmkv';

const Stack = createNativeStackNavigator<RootStackParamList>();
const BSStack = createBottomSheetNavigator<RootStackParamList>();

function BSNavigator() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const topOffset = Platform.OS === 'ios' ? insets.top : insets.top + 16;

  // eslint-disable-next-line react/no-unstable-nested-components
  function Backdrop() {
    const { variant } = useTheme();
    return (
      <BlurView
        blurAmount={1}
        blurType={variant === 'dark' ? 'regular' : 'extraDark'}
        reducedTransparencyFallbackColor="white"
        style={StyleSheet.absoluteFill}
      />
    );
  }

  return (
    <BSStack.Navigator>
      <BSStack.Screen component={TabNavigator} name="tabs" />
      <BSStack.Screen component={Scan} name="scan" options={{ height: height - topOffset }} />
      <BSStack.Screen component={Sessions} name="walletconnect-sessions" options={{ height: height * 0.8 }} />
      <BSStack.Screen component={SessionProposal} name="session-proposal" options={{ height: height * 0.8 }} />
      <BSStack.Screen component={SessionRequest} name="session-request" options={{ height: height * 0.8 }} />
      {/* <BSStack.Screen component={Receive} name="receive" options={{ backdropComponent: Backdrop }} /> */}
      {/* <BSStack.Screen component={Receive} name="receive" options={{ backdropOpacity: 0.8 }} /> */}
      {/* <BSStack.Screen component={Reset} name="send" options={{ height: height * 0.8 }} /> */}
      <BSStack.Screen component={Reset} name="swap" options={{ height: height * 0.8 }} />
      <BSStack.Screen component={Reset} name="bridge" options={{ height: height * 0.8 }} />
      <BSStack.Screen component={Reset} name="settings" options={{ height: height * 0.8 }} />
    </BSStack.Navigator>
  );
}

function SendNavigator() {
  // 	const { height } = useWindowDimensions();
  // 	return (
  // 		<BSStack.Navigator>
  // 			<BSStack.Screen component={Send} name="receipent" options={{ height: height * 0.5 }} />
  // 			<BSStack.Screen component={ScanAddress} name="scanAddress" options={{ height: height * 0.92 }} />
  // 			<BSStack.Screen component={Reset} name="chooseToken" options={{ height: height * 0.5 }} />
  // 			<BSStack.Screen component={Reset} name="chooseWallet" options={{ height: height * 0.5 }} />
  // 			<BSStack.Screen component={Reset} name="confirmSend" options={{ height: height * 0.5 }} />
  // 		</BSStack.Navigator>
  // 	);
}

function WalletNavigator() {
  const { height } = useWindowDimensions();

  return (
    <BSStack.Navigator>
      <BSStack.Screen component={Welcome} name="home" />
      <BSStack.Screen component={CreateWallet} name="create-wallet" options={{ height: height * 0.5 }} />
      <BSStack.Screen component={ImportWallet} name="import-wallet" options={{ height: height * 0.5 }} />
      <BSStack.Screen component={SetPassword} name="set-password" options={{ height: height * 0.5 }} />
    </BSStack.Navigator>
  );
}

function AuthNavigator() {
  const { height } = useWindowDimensions();

  return (
    <BSStack.Navigator>
      <BSStack.Screen component={Login} name="login" />
      <BSStack.Screen component={Reset} name="reset" options={{ height: height * 0.4 }} />
    </BSStack.Navigator>
  );
}

function RootNavigator() {
  const { navigationTheme, variant, backgrounds } = useTheme();

  const initialized = storage.getString('initialized');
  const onboarding = storage.getString('onboarding');

  // const initialRouteName = !onboarding ? 'onboarding' : !initialized ? 'welcome' : 'root';
  const initialRouteName = !onboarding ? 'onboarding' : !initialized ? 'root' : 'root';

  console.log({ initialized, onboarding, initialRouteName, f: storage.getAllKeys() });

  const barStyle = variant === 'dark' ? 'light-content' : 'dark-content';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linking: LinkingOptions<any> = {
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
  };

  const onStateChange = (state: NavigationState | undefined) => {
    // Can be used for analytics
    console.log(`onNavigationStateChange: ${state?.key}`);
  };

  const onReady = () => {
    // sentryRoutingInstrumentation.registerNavigationContainer(navigationRef);
  };

  return (
    <NavigationContainer
      // @ts-ignore
      ref={navigationRef}
      linking={linking}
      theme={navigationTheme}
      onStateChange={onStateChange}
      onReady={onReady}>
      {/* <StatusBar barStyle={barStyle} backgroundColor={navigationTheme.colors.background} /> */}
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Onboarding} name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen component={WalletNavigator} name="welcome" options={{ gestureEnabled: false }} />
        <Stack.Screen component={AuthNavigator} name="auth" options={{ gestureEnabled: false }} />
        <Stack.Screen component={BSNavigator} name="root" options={{ gestureEnabled: false }} />
        {/* <Stack.Screen component={SendNavigator} name="send" options={{ presentation: 'modal' }} /> */}
        {/* <Stack.Screen component={Receive} name="receive" options={{ presentation: 'modal' }} /> */}
        {/* <Stack.Screen
					component={Wallet}
					name="wallet"
					options={{
						headerShown: true,
						title: 'Wallet',
						headerBackTitle: 'Home',
						headerBackTitleVisible: false,
						headerStyle: backgrounds.ui_background,
					}}
				/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ToastProvider({ children }: { children: ReactNode }) {
  const { top } = useSafeAreaInsets();

  return (
    <>
      {children}
      <Toast topOffset={top < 32 ? top * 1.25 : top} />
    </>
  );
}

export default memo(RootNavigator);
