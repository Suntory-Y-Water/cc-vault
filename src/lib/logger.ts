import pino, { type LoggerOptions, stdTimeFunctions } from 'pino';

const loggerName = 'cc-vault';
const coreLogger = createCoreLogger();

type AppLogger = pino.Logger;

/**
 * Returns the shared application logger instance for emitting structured logs.
 */
export function getLogger(context?: string): AppLogger {
  if (!context) {
    return coreLogger;
  }

  return coreLogger.child({ loggerContext: `-${context}-` });
}

/**
 * Derives the core pino logger configured for the runtime environment.
 */
function createCoreLogger(): pino.Logger {
  const options: LoggerOptions = {
    name: loggerName,
    level: resolveLogLevel(),
    base: undefined,
    timestamp: stdTimeFunctions.isoTime,
  };

  const processLike = getNodeProcess();

  if (shouldUsePretty(processLike)) {
    const prettyDestination = createPrettyDestination(processLike);
    if (prettyDestination) {
      return pino(options, prettyDestination);
    }
  }

  return pino(options);
}

/**
 * Resolves the log level from environment-aware sources with an info fallback.
 */
type NodeProcessLike = {
  stdout?: { isTTY?: boolean; write?: (chunk: string | Uint8Array) => unknown };
  env?: Record<string, string | undefined>;
};

function getNodeProcess(): NodeProcessLike | undefined {
  const globalContext = globalThis as { process?: NodeProcessLike };
  return globalContext.process;
}

function shouldUsePretty(processLike?: NodeProcessLike): boolean {
  if (!processLike) {
    return false;
  }

  const preference = processLike.env?.PINO_PRETTY;
  if (preference === 'false') {
    return false;
  }

  if (preference === 'true') {
    return true;
  }

  return Boolean(processLike.stdout?.isTTY);
}

function createPrettyDestination(processLike?: NodeProcessLike) {
  const stdout = processLike?.stdout;
  const write =
    typeof stdout?.write === 'function' ? stdout.write.bind(stdout) : undefined;
  if (!write) {
    return undefined;
  }

  const useColors = Boolean(stdout?.isTTY);

  return {
    write(chunk: string | Uint8Array) {
      try {
        const input = typeof chunk === 'string' ? chunk : chunk.toString();
        const log = JSON.parse(input);
        const { level, time, msg, ...rest } = log as {
          level: number | string;
          time?: string | number;
          msg?: unknown;
        } & Record<string, unknown>;

        const { loggerContext, ...metadata } = rest as {
          loggerContext?: unknown;
        } & Record<string, unknown>;

        const levelLabel =
          typeof level === 'number'
            ? (pino.levels.labels[level] ?? String(level))
            : String(level);
        const formattedLevel = formatLevel(levelLabel, useColors);

        const isoTime =
          typeof time === 'string'
            ? time
            : typeof time === 'number'
              ? new Date(time).toISOString()
              : new Date().toISOString();
        const timestamp = formatTimestamp(isoTime);

        const message =
          typeof msg === 'string'
            ? msg
            : msg !== undefined
              ? JSON.stringify(msg)
              : '';

        const contextValue = formatContextValue(loggerContext);
        const metadataKeys = Object.keys(metadata);
        const metadataSegment =
          metadataKeys.length > 0 ? ` ${JSON.stringify(metadata)}` : '';

        const segments = [formattedLevel];
        if (contextValue) {
          segments.push(contextValue);
        }
        segments.push(timestamp);
        if (message) {
          segments.push(message);
        }

        write(`${segments.join(', ')}${metadataSegment}\n`);
      } catch {
        write(chunk);
      }
    },
  };
}

function formatContextValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatLevel(level: string, useColors: boolean): string {
  const label = level.toUpperCase();
  if (!useColors) {
    return label;
  }

  const color =
    levelColorMap[level as keyof typeof levelColorMap] ?? '\u001B[37m';
  return `${color}${label}\u001B[0m`;
}

function formatTimestamp(iso: string): string {
  const [datePart] = iso.split('Z');
  return datePart?.split('.')[0] ?? iso;
}

const levelColorMap = {
  trace: '\u001B[90m',
  debug: '\u001B[35m',
  info: '\u001B[36m',
  warn: '\u001B[33m',
  error: '\u001B[31m',
  fatal: '\u001B[41m',
} as const;

function resolveLogLevel(): string {
  const globalContext = globalThis as {
    LOG_LEVEL?: string;
    process?: { env?: Record<string, unknown> };
  };

  const envLevel = globalContext.process?.env?.LOG_LEVEL;
  if (typeof envLevel === 'string' && envLevel.length > 0) {
    return envLevel;
  }

  return typeof globalContext.LOG_LEVEL === 'string' &&
    globalContext.LOG_LEVEL.length > 0
    ? globalContext.LOG_LEVEL
    : 'info';
}
