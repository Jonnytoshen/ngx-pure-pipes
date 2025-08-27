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

/**
 * Rounds a number to a specified number of decimal places
 *
 * This function provides precise decimal rounding using mathematical scaling
 * to avoid floating-point precision issues. It handles edge cases like
 * negative precision gracefully and ensures accurate results for financial
 * calculations and data formatting.
 *
 * The function uses the multiply-round-divide approach:
 * 1. Multiply by 10^precision to shift decimal places
 * 2. Apply Math.round() for standard rounding rules
 * 3. Divide by 10^precision to restore original scale
 *
 * @example
 * ```typescript
 * // Basic rounding to integers
 * round(3.14159) // Returns: 3
 * round(3.7) // Returns: 4
 *
 * // Rounding to specific decimal places
 * round(3.14159, 2) // Returns: 3.14
 * round(3.14159, 4) // Returns: 3.1416
 *
 * // Financial calculations
 * round(19.95 * 1.08, 2) // Returns: 21.55 (price with tax)
 *
 * // Negative precision defaults to integer rounding
 * round(3.14159, -1) // Returns: 3
 * ```
 *
 * @param value - The number to round
 * @param precision - Number of decimal places to round to (default: 0)
 *                   If negative, defaults to integer rounding
 * @returns The rounded number with the specified precision
 */
export function round(value: number, precision = 0): number {
  // Handle negative precision by defaulting to integer rounding
  if (precision < 0) {
    precision = 0;
  }

  // Calculate scaling factor (10^precision)
  const factor = 10 ** precision;

  // Scale up, round, then scale back down for precise decimal rounding
  const result = Math.round((value + Number.EPSILON) * factor) / factor;

  // Handle negative zero case
  return result === 0 ? 0 : result;
}

/**
 * Checks if a value is a valid number (excluding NaN)
 *
 * This function provides a reliable way to determine if a value is a valid number
 * that can be used in mathematical operations. It performs both type checking
 * and NaN validation in a single operation, which is more robust than using
 * typeof alone since NaN has typeof 'number' but is not a usable numeric value.
 *
 * The function uses TypeScript type guards to provide compile-time type safety,
 * allowing TypeScript to narrow the type automatically after the check.
 *
 * @example
 * ```typescript
 * // Basic number validation
 * if (isNumber(value)) {
 *   // TypeScript knows value is number here
 *   const result = value * 2;
 * }
 *
 * // Input validation in pipes
 * if (!isNumber(input)) {
 *   return null; // Invalid input
 * }
 * return input.toFixed(2);
 * 
 * // Array filtering
 * const validNumbers = mixedArray.filter(isNumber);
 * // validNumbers is typed as number[]
 * ```
 *
 * @example
 * ```typescript
 * // Returns true for valid numbers
 * isNumber(42) // true
 * isNumber(3.14) // true
 * isNumber(-17) // true
 * isNumber(0) // true
 * isNumber(Infinity) // true
 * isNumber(-Infinity) // true
 *
 * // Returns false for invalid values
 * isNumber(NaN) // false
 * isNumber('42') // false
 * isNumber(null) // false
 * isNumber(undefined) // false
 * isNumber({}) // false
 * isNumber([]) // false
 * ```
 *
 * @param value - The value to check for valid number type
 * @returns True if the value is a valid number (not NaN), false otherwise
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
