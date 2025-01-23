import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'rely', encryptionKey: 'rely' });

/**
 * Redux state is stored in MMKV and user's password is stored in keychain.
 * MMKV is encrypted with the user's password to ensure data is secure.
 * @param password
 */
export const encrypt = (password: string) => {
  storage.recrypt(password);
};

export const STORAGE_IDS = {
  ACCOUNT: 'ACCOUNT',
  ASPECT_RATIO: 'ASPECT_RATIO',
  DOMINANT_COLOR: 'DOMINANT_COLOR',
  EXPERIMENTAL_CONFIG: 'EXPERIMENTAL_CONFIG',
  FIRST_APP_LAUNCH: 'FIRST_APP_LAUNCH',
  SWAPS_METADATA_STORAGE: 'SWAP_METADATA_STORAGE',
  LOCAL_STORAGE_ADAPTER: 'LOCAL_STORAGE_ADAPTER',
  NOTIFICATIONS: 'NOTIFICATIONS',
  RAINBOW_TOKEN_LIST: 'LEAN_RAINBOW_TOKEN_LIST',
  SHOWN_SWAP_RESET_WARNING: 'SHOWN_SWAP_RESET_WARNING',
  PROMO_CURRENTLY_SHOWN: 'PROMO_CURRENTLY_SHOWN',
  LAST_PROMO_SHEET_TIMESTAMP: 'LAST_PROMO_SHEET_TIMESTAMP',
  UNLOCKABLE_APP_ICONS: 'UNLOCKABLE_APP_ICONS',
};
