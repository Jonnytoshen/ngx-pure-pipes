/**
 * Utility functions for type checking and validation
 * 
 * This module provides type-safe utility functions for common type checks
 * used throughout the ngx-pure-pipes library. All functions use TypeScript
 * type guards to provide compile-time type safety.
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

/**
 * Checks if a value is null or undefined (nil)
 * 
 * This function provides a type-safe way to check for null or undefined values
 * using a TypeScript type guard. It's commonly used for defensive programming
 * and input validation in pipe implementations.
 * 
 * @example
 * ```typescript
 * if (isNil(value)) {
 *   return defaultValue;
 * }
 * 
 * // Type narrowing works automatically
 * const result = isNil(someValue) ? 'empty' : someValue.toString();
 * ```
 * 
 * @param value - The value to check for null or undefined
 * @returns True if the value is null or undefined, false otherwise
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is a RegExp object
 * 
 * This function provides a reliable way to determine if a value is a regular expression
 * object. It uses Object.prototype.toString for accurate type detection, which is
 * more reliable than instanceof checks that can fail across different execution contexts.
 * 
 * @example
 * ```typescript
 * if (isRegExp(pattern)) {
 *   // TypeScript knows pattern is RegExp here
 *   return text.match(pattern);
 * }
 * 
 * // Usage in validation
 * const userRegex = getUserInput();
 * if (isRegExp(userRegex)) {
 *   processWithRegex(userRegex);
 * }
 * ```
 * 
 * @param value - The value to check for RegExp type
 * @returns True if the value is a RegExp object, false otherwise
 */
export function isRegExp(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]';
}
