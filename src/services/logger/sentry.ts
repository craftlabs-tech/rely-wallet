import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';

import { ErrorLog, logger } from '@/services/logger';

const IS_TEST = process.env.NODE_ENV === 'test';
const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT;

const versionNumber = DeviceInfo.getVersion();
const bundleId = DeviceInfo.getBundleId();

export const defaultOptions: Sentry.ReactNativeOptions = {
  attachStacktrace: true,
  dsn: SENTRY_DSN,
  enableAppHangTracking: false,
  enableAutoPerformanceTracing: false,
  enableAutoSessionTracking: false,
  enableTracing: false,
  environment: SENTRY_ENVIRONMENT,
  integrations: [],
  maxBreadcrumbs: 10,
  tracesSampleRate: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function initSentry(navigationIntegration: any) {
  if (IS_TEST) {
    logger.debug(`[sentry]: disabled for test environment`);
    return;
  }
  try {
    const dist = `${versionNumber}`; // MUST BE A STRING
    const release = `${bundleId}@${versionNumber}+${dist}`; // MUST BE A STRING

    Sentry.init({
      ...defaultOptions,
      integrations: [navigationIntegration],
      // uncomment the line below to enable Spotlight (https://spotlightjs.com)
      spotlight: __DEV__,
      dist, // MUST BE A STRING or Sentry will break in native code
      release, // MUST BE A STRING or Sentry will break in native code
    });

    logger.debug(`[sentry]: Successfully initialized`);
  } catch (error) {
    logger.debug(JSON.stringify(error));
    logger.error(new ErrorLog(`[sentry]: initialization failed`));
  }
}
