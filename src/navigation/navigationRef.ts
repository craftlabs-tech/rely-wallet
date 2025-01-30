/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RootStackParamList } from './types';

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: string, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as any);
  }
}
