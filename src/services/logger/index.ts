import type { SeverityLevel } from '@sentry/types';

import * as Sentry from '@sentry/react-native';
import { format } from 'date-fns';

import { getExperimetalFlag, LOG_PUSH } from '@/config/experimental';
import { DebugContext } from '@/services/logger/debugContext';
import { push } from '@/services/logger/logDump';
import { storage } from '@/services/mmkv';

const LOG_DEBUG = process.env.LOG_DEBUG;
const LOG_LEVEL = process.env.LOG_LEVEL;

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_TEST = process.env.NODE_ENV === 'test';

export enum LogLevel {
  Debug = 'debug',
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
  Fatal = 'fatal',
}

type Transport = (level: LogLevel, message: string | ErrorLog, metadata: Metadata) => void;

/**
 * A union of some of Sentry's breadcrumb properties as well as Sentry's
 * `captureException` parameter, `CaptureContext`.
 */
type Metadata = {
  /**
   * Applied as Sentry breadcrumb types. Defaults to `default`.
   *
   * @see https://develop.sentry.dev/sdk/event-payloads/breadcrumbs/#breadcrumb-types
   */
  type?: 'default' | 'debug' | 'error' | 'navigation' | 'http' | 'info' | 'query' | 'transaction' | 'ui' | 'user';

  /**
   * Passed through to `Sentry.captureException`
   *
   * @see https://github.com/getsentry/sentry-javascript/blob/903addf9a1a1534a6cb2ba3143654b918a86f6dd/packages/types/src/misc.ts#L65
   */
  tags?: {
    [key: string]: number | string | boolean | bigint | symbol | null | undefined;
  };

  /**
   * Any additional data, passed through to Sentry as `extra` param on
   * exceptions, or the `data` param on breadcrumbs.
   */
  [key: string]: unknown;
} & Parameters<typeof Sentry.captureException>[1];

const enabledLogLevels: {
  [key in LogLevel]: LogLevel[];
} = {
  [LogLevel.Debug]: [LogLevel.Debug, LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
  [LogLevel.Info]: [LogLevel.Info, LogLevel.Log, LogLevel.Warn, LogLevel.Error],
  [LogLevel.Log]: [LogLevel.Log, LogLevel.Warn, LogLevel.Error],
  [LogLevel.Warn]: [LogLevel.Warn, LogLevel.Error],
  [LogLevel.Error]: [LogLevel.Error],
  [LogLevel.Fatal]: [LogLevel.Fatal],
};

/**
 * Color handling copied from Kleur
 *
 * @see https://github.com/lukeed/kleur/blob/fa3454483899ddab550d08c18c028e6db1aab0e5/colors.mjs#L13
 */
const colors: {
  [key: string]: [number, number];
} = {
  default: [0, 0],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39],
};

function withColor([x, y]: [number, number]) {
  const rgx = new RegExp(`\\x1b\\[${y}m`, 'g');
  const close = `\u001b[${y}m`,
    open = `\u001b[${x}m`;

  return function (txt: string) {
    if (txt == null) {
      return txt;
    }
    // eslint-disable-next-line no-extra-boolean-cast
    return open + (~('' + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}

/**
 * A developer setting that pushes log lines to an array in-memory so that
 * they can be "dumped" or copied out of the app and analyzed.
 */
const LOG_PUSH_ENABLED = getExperimetalFlag(LOG_PUSH);

/**
 * Used in dev mode to nicely log to the console
 */
export const consoleTransport: Transport = (level, message, metadata) => {
  const timestamp = format(new Date(), 'HH:mm:ss');
  const extra = Object.keys(metadata).length ? ' ' + JSON.stringify(metadata, null, '  ') : '';
  const color = {
    [LogLevel.Debug]: colors.magenta,
    [LogLevel.Info]: colors.default,
    [LogLevel.Log]: colors.default,
    [LogLevel.Warn]: colors.yellow,
    [LogLevel.Error]: colors.red,
    [LogLevel.Fatal]: colors.red,
  }[level];
  // needed for stacktrace formatting
  // eslint-disable-next-line no-console
  const log = level === LogLevel.Error ? console.error : console.log;

  if (LOG_PUSH_ENABLED) {
    push({
      timestamp,
      level,
      message,
      metadata,
    });
  }

  log(`${timestamp} ${withColor(color)(`[${level.toUpperCase()}]`)} ${message.toString()}${extra}`);
};

export const sentryTransport: Transport = (level: LogLevel, message, { type, tags, ...metadata }) => {
  const severityMap: { [key in LogLevel]: SeverityLevel } = {
    [LogLevel.Debug]: 'debug',
    [LogLevel.Info]: 'info',
    [LogLevel.Log]: 'log',
    [LogLevel.Warn]: 'warning',
    [LogLevel.Error]: 'error',
    [LogLevel.Fatal]: 'fatal',
  };

  const severity = severityMap[level];

  /**
   * If a string, report a breadcrumb
   */
  if (typeof message === 'string') {
    Sentry.addBreadcrumb({
      message,
      data: metadata,
      type: type || 'default',
      level: severity,
      timestamp: Date.now(),
    });

    /**
     * If a log, also capture as a message
     */
    if (level === LogLevel.Log) {
      Sentry.captureMessage(message, {
        tags,
        extra: metadata,
      });
    }

    /**
     * If warn, also capture as a message, but with level warning
     */
    if (level === LogLevel.Warn) {
      Sentry.captureMessage(message, {
        level: severity,
        tags,
        extra: metadata,
      });
    }
  } else {
    /**
     * It's otherwise an Error and should be reported as onReady
     */
    Sentry.captureException(message, {
      tags,
      extra: metadata,
    });
  }
};

export class ErrorLog extends Error {}

/**
 * Main class. Defaults are provided in the constructor so that subclasses are
 * technically possible, if we need to go that route in the future.
 */
export class Logger {
  protected debugContextRegexes: RegExp[] = [];
  DebugContext = DebugContext;

  enabled: boolean;
  level: LogLevel;
  LogLevel = LogLevel;

  transports: Transport[] = [];

  constructor({
    enabled = !IS_TEST && !storage.getBoolean('doNotTrack'),
    level = LOG_LEVEL as LogLevel,
    debug = LOG_DEBUG || '',
  }: {
    enabled?: boolean;
    level?: LogLevel;
    debug?: string;
  } = {}) {
    this.enabled = enabled !== false;
    this.level = debug ? LogLevel.Debug : (level ?? LogLevel.Warn);
    this.debugContextRegexes = (debug || '').split(',').map((context) => {
      return new RegExp(context.replace(/[^\w*:]/, '').replaceAll('*', '.*'));
    });
  }

  protected transport(level: LogLevel, message: string | ErrorLog, metadata: Metadata = {}) {
    if (!this.enabled) {
      return;
    }
    if (!enabledLogLevels[this.level].includes(level)) {
      return;
    }

    for (const transport of this.transports) {
      // metadata fallback accounts for JS usage
      transport(level, message, metadata || {});
    }
  }

  addTransport(transport: Transport) {
    this.transports.push(transport);
    return () => {
      this.transports.splice(this.transports.indexOf(transport), 1);
    };
  }

  debug(message: string, metadata: Metadata = {}, context?: string) {
    // eslint-disable-next-line unicorn/prefer-array-some
    if (context && !this.debugContextRegexes.find((reg) => reg.test(context))) {
      return;
    }
    this.transport(LogLevel.Debug, message, metadata);
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  error(error: ErrorLog, metadata: Metadata = {}) {
    if (error instanceof ErrorLog) {
      this.transport(LogLevel.Error, error, metadata);
    } else {
      this.transport(LogLevel.Error, new ErrorLog(`logger.error was not provided a ErrorLog`), metadata);
    }
  }

  info(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Info, message, metadata);
  }

  log(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Log, message, metadata);
  }

  warn(message: string, metadata: Metadata = {}) {
    this.transport(LogLevel.Warn, message, metadata);
  }
}

/**
 * Rainbow's logger. See `@/logger/README` for docs.
 *
 * Basic usage:
 *
 *   `logger.debug(message[, metadata, debugContext])`
 *   `logger.info(message[, metadata])`
 *   `logger.warn(message[, metadata])`
 *   `logger.error(ErrorLog[, metadata])`
 *   `logger.disable()`
 *   `logger.enable()`
 */
export const logger = new Logger();

/**
 * Report to console in dev, Sentry in prod, nothing in test.
 */
if (IS_DEV) {
  logger.addTransport(consoleTransport);

  /**
   * Uncomment this to test Sentry in dev
   */
  // logger.addTransport(sentryTransport);
} else if (IS_PROD) {
  logger.addTransport(sentryTransport);

  if (LOG_PUSH_ENABLED) {
    logger.addTransport(consoleTransport);
    logger.level = LogLevel.Debug;
  }
}
