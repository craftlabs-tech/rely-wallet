import 'react-native-gesture-handler';
import '@walletconnect/react-native-compat';
import 'fast-text-encoding';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from '@/theme';
import ApplicationNavigator from '@/navigation/Application';

import { storage } from '@/services/mmkv';
import { persistor, store } from '@/store';

import '@/translations';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider storage={storage}>
              <SafeAreaProvider>
                <BottomSheetModalProvider>
                  <ApplicationNavigator />
                </BottomSheetModalProvider>
              </SafeAreaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
