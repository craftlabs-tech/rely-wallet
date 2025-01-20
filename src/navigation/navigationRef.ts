/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NavigationContainerRef } from '@react-navigation/native';

import { useRef } from 'react';

export const navigationRef = useRef<NavigationContainerRef<any>>(null);

export function navigate(name: string, params: any) {
  if (navigationRef.current && navigationRef.current.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name as never, params as any);
  }
}
