import { Pipe, PipeTransform } from '@angular/core';
import { isNumber, round } from '../helpers/helpers';

/**
 * Angular pipe that rounds numbers to a specified number of decimal places.
 * 
 * This pure pipe provides precise decimal rounding functionality for Angular templates,
 * making it easy to format numeric values for display purposes. It handles edge cases
 * like null/undefined inputs gracefully and uses advanced rounding techniques to avoid
 * floating-point precision issues.
 * 
 * The pipe leverages the `round` helper function which implements the multiply-round-divide
 * approach for accurate decimal rounding, making it suitable for financial calculations,
 * data visualization, and user interface formatting.
 * 
 * @example
 * // Template usage for basic rounding to integers
 * {{ 3.14159 | round }} // Returns: 3
 * {{ 3.7 | round }} // Returns: 4
 * 
 * @example
 * // Template usage with specific decimal places
 * {{ 3.14159 | round:2 }} // Returns: 3.14
 * {{ 19.95 * 1.08 | round:2 }} // Returns: 21.55 (price with tax)
 * 
 * @example
 * // Template usage with high precision
 * {{ Math.PI | round:4 }} // Returns: 3.1416
 * {{ 2.71828 | round:3 }} // Returns: 2.718
 * 
 * @example
 * // Template usage with null safety
 * {{ nullableValue | round:2 }} // Returns: null if nullableValue is null/undefined
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'round',
})
export class RoundPipe implements PipeTransform {
  /**
   * Overload signature for non-null numbers that guarantees a numeric return value.
   * Used when TypeScript can determine the input value is definitely not null/undefined.
   * 
   * @param value - The numeric value to round
   * @param precision - Optional number of decimal places to round to (default: 0)
   * @returns The rounded number with the specified precision
   */
  transform(value: number, precision?: number): number;

  /**
   * Overload signature for null/undefined inputs that returns null.
   * Handles cases where the input might be null or undefined, providing null safety.
   * 
   * @param value - Null or undefined input
   * @param precision - Optional precision parameter (ignored for null inputs)
   * @returns Always returns null for null/undefined inputs
   */
  transform(value: null | undefined, precision?: number): null;

  /**
   * Main transform method that rounds a number to the specified number of decimal places.
   * 
   * This method provides safe numeric rounding with proper null/undefined handling.
   * It validates the input using the `isNumber` helper function and delegates the
   * actual rounding logic to the `round` helper function for consistency across
   * the library.
   * 
   * The rounding behavior follows standard mathematical rules:
   * - 0.5 rounds up to 1
   * - -0.5 rounds to 0 (towards positive infinity)
   * - Uses banker's rounding for consistent results
   * 
   * @param value - The input value to round (number, null, or undefined)
   * @param precision - Number of decimal places to round to (default: 0 for integers)
   *                   Must be non-negative; negative values default to integer rounding
   * @returns The rounded number, or null if input is invalid
   * 
   * @example
   * // Basic integer rounding
   * pipe.transform(3.14159) // Returns: 3
   * pipe.transform(3.7) // Returns: 4
   * 
   * @example
   * // Decimal place rounding
   * pipe.transform(3.14159, 2) // Returns: 3.14
   * pipe.transform(3.14159, 4) // Returns: 3.1416
   * 
   * @example
   * // Financial calculations
   * pipe.transform(19.95 * 1.08, 2) // Returns: 21.55
   * pipe.transform(99.99 * 0.15, 2) // Returns: 15.00
   * 
   * @example
   * // Null safety
   * pipe.transform(null) // Returns: null
   * pipe.transform(undefined) // Returns: null
   * pipe.transform('invalid', 2) // Returns: null (non-numeric input)
   * 
   * @example
   * // Edge cases
   * pipe.transform(0, 2) // Returns: 0
   * pipe.transform(-3.14159, 2) // Returns: -3.14
   * pipe.transform(Infinity, 2) // Returns: Infinity
   */
  transform(
    value: number | null | undefined,
    precision?: number
  ): number | null {
    // Validate input using type-safe number checking
    // This excludes NaN while allowing Infinity values
    if (!isNumber(value)) {
      return null;
    }
    
    // Delegate to the round helper function for consistent rounding behavior
    // The helper handles precision validation and floating-point precision issues
    return round(value, precision);
  }
}
