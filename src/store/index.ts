import type { Storage } from 'redux-persist';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { MMKV } from 'react-native-mmkv';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import wallet from './wallet';

export const storage = new MMKV();

export const reduxStorage: Storage = {
  setItem: (key, value: string | number | boolean | Uint8Array) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  whitelist: ['wallet'],
};

const reducers = combineReducers({ wallet });

const persistedReducer = persistReducer(persistConfig, reducers);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middlewares: any[] = [];

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(middlewares),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export { persistor, store };
