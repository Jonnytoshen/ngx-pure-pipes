import { Pipe, PipeTransform } from '@angular/core';

/**
 * Min aggregation pipe
 * 
 * Finds the minimum value in an array. Supports three modes of operation:
 * 1. Primitive arrays: finds the minimum primitive value
 * 2. Object arrays with property key: finds object with minimum property value
 * 3. Object arrays with getter function: finds object with minimum computed value
 * 
 * Returns the entire item with the minimum value, not just the minimum value itself.
 * 
 * @example
 * ```typescript
 * // Basic usage with numbers
 * [5, 2, 8, 1, 9] | min
 * // Result: 1
 * 
 * // Find user with minimum age using property key
 * const users = [
 *   { name: 'John', age: 25 },
 *   { name: 'Jane', age: 22 },
 *   { name: 'Bob', age: 30 }
 * ];
 * users | min:'age'
 * // Result: { name: 'Jane', age: 22 }
 * 
 * // Find product with lowest price using getter function
 * const products = [
 *   { name: 'Laptop', basePrice: 1000, discount: 0.1 },
 *   { name: 'Phone', basePrice: 800, discount: 0.2 },
 *   { name: 'Tablet', basePrice: 600, discount: 0.05 }
 * ];
 * products | min:(item => item.basePrice * (1 - item.discount))
 * // Result: { name: 'Tablet', basePrice: 600, discount: 0.05 }
 * 
 * // Use in template
 * <p>Youngest user: {{ users | min:'age' | json }}</p>
 * <p>Cheapest item: {{ products | min:'price' | json }}</p>
 * 
 * // Handle empty arrays
 * [] | min  // Result: null
 * ```
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'min',
})
export class MinPipe implements PipeTransform {
  /**
   * Finds the item with minimum value in a valid array
   * 
   * @param value - The array to search for minimum
   * @param getter - Property key or function to extract comparison value
   * @returns The entire object that has the minimum value
   */
  transform<T, Key extends keyof T>(
    value: readonly T[],
    getter?: Key | ((item: T) => number)
  ): T;
  
  /**
   * Overload for handling null or undefined arrays
   * 
   * @param value - null or undefined value
   * @returns null
   */
  transform(value: null | undefined): null;
  
  /**
   * Main implementation for finding minimum value in array
   * 
   * Supports three extraction modes:
   * 1. No getter: treats array items as numbers directly
   * 2. Property key: extracts numeric value from specified property
   * 3. Getter function: uses custom function to compute comparison value
   * 
   * @param value - The array to process, can be null or undefined
   * @param getter - Optional property key or function for value extraction
   * @returns The item with minimum value, or null if array is empty/invalid
   */
  transform<T, Key extends keyof T>(
    value: readonly T[] | null | undefined,
    getter?: Key | ((item: T) => number)
  ): T | null {
    // Return null immediately if input is not a valid non-empty array
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    // Create a value extraction function based on the getter parameter
    const get = (v: T) => {
      // If getter is a function, use it to compute the comparison value
      if (typeof getter === 'function') {
        return getter(v);
      }
      // If no getter provided, treat the item itself as a number
      if (getter === undefined) {
        return v as unknown as number;
      }
      // If getter is a property key, extract that property's value
      return v[getter as keyof T] as number;
    };

    // Use reduce to find the item with minimum extracted value
    // Compare using the get function and return the entire item
    return value.reduce((a, b) => (get(a) <= get(b) ? a : b));
  }
}
