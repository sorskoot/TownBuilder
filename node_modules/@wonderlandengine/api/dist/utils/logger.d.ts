import { BitSet } from './bitset.js';
import { Emitter } from './event.js';
/**
 * Logging levels supported by {@link Logger}.
 */
export declare enum LogLevel {
    Info = 0,
    Warn = 1,
    Error = 2
}
/**
 * Logging wrapper.
 *
 * This is used to allow turning on/off:
 *     - `console.log`
 *     - `console.warn`
 *     - `console.error`
 *
 * #### Usage
 *
 * ```js
 * import {Logger, LogLevel, LogTag} from '@wonderlandengine/api';
 *
 * // Create a logger with only the "error" and "warn" levels activated
 * const logger = new Logger(LogLevel.Warn, LogLevel.Error);
 *
 * // Only the "error" and "warn" levels are activated,
 * // this message isn't logged.
 * logger.info(LogTag.Component, 'This message is shushed')
 *
 * // Prints 'Hello Error!'
 * logger.error(LogTag.Component, 'Hello Error!');
 *
 * // Prints 'Hello Warning!'
 * logger.warn(LogTag.Component, 'Hello Warning!');
 * ```
 *
 * The log levels can be changed at anytime using the {@link BitSet} api:
 *
 * ```js
 * // Enable the "info" level
 * logger.levels.enable(LogLevel.Info);
 * * // Disable the "warn" level
 * logger.levels.disable(LogLevel.Warn);
 * ```
 *
 * #### Tags
 *
 * In addition, the logger supports tagging messages:
 *
 * ```js
 * import {Logger, LogLevel, LogTag} from '@wonderlandengine/api';
 *
 * const logger = new Logger(LogLevel.Info);
 *
 * logger.tags.disableAll();
 *
 * // All tags are off, this message isn't logged
 * logger.info(LogTag.Component, 'This message is shushed');
 *
 * logger.tags.enable(LogTag.Component);
 * logger.info(LogTag.Component, 'Hello World!') // Prints 'Hello World!'
 * ```
 *
 * The tagging system gives another layer of control to enable / disable
 * some specific logs.
 */
export declare class Logger {
    /**
     * Bitset of enabled levels.
     *
     * @hidden
     */
    levels: BitSet<LogLevel>;
    /**
     * Bitset of enabled tags.
     *
     * @hidden
     */
    tags: BitSet;
    /**
     * Notified when an `info`, `warn`, or `error` message is logged.
     *
     * @note The emitter is always notified, even if the logger levels
     * and tags are disabled.
     *
     * @note The message is passed as an array, similar to `console.log`.
     *
     * #### Usage
     *
     * ```js
     * import {LogLevel} from '@wonderlandengine/api';
     *
     * engine.logger.onLog.add((level, messages, tag) => {
     *     // Only process error messages
     *     if (level !== LogLevel.Error) return;
     *
     *     // Only process engine logs
     *     if (tag !== LogTag.Engine) return;
     *
     *     const str = messages.join(' ');
     *     sendAnalytics(str);
     * });
     * ```
     */
    onLog: Emitter<[LogLevel, unknown[], number]>;
    /**
     * Create a new logger instance.
     *
     * @param levels Default set of levels to enable.
     */
    constructor(...levels: LogLevel[]);
    /**
     * Log the message(s) using `console.log`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    info(tag: number, ...msg: unknown[]): this;
    /**
     * Log the message(s) using `console.warn`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    warn(tag: number, ...msg: unknown[]): this;
    /**
     * Log the message(s) using `console.error`.
     *
     * @param tag Tag represented by a positive integer.
     * @param msg A spread of message to log.
     * @returns Reference to self (for method chaining).
     */
    error(tag: number, ...msg: unknown[]): this;
}
