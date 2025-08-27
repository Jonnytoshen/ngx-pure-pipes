import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that finds the element with the maximum value in an array.
 * 
 * This pure pipe provides three modes of operation:
 * 1. For primitive arrays (numbers): Returns the element with the highest numeric value
 * 2. For object arrays with property key: Returns the object with the highest value for the specified property
 * 3. For object arrays with getter function: Returns the object with the highest computed value
 * 
 * The pipe is immutable and does not modify the original array.
 * 
 * @example
 * // Template usage with primitive array
 * {{ [5, 2, 8, 1, 9] | max }} // Returns: 9
 * 
 * @example
 * // Template usage with object array and property key
 * {{ users | max:'age' }} // Returns: user object with highest age
 * 
 * @example
 * // Template usage with getter function
 * {{ products | max:getPrice }} // Returns: product with highest computed price
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'max',
})
export class MaxPipe implements PipeTransform {
  /**
   * Overload signature for non-null arrays that guarantees a non-null return value.
   * Used when TypeScript can determine the input array is definitely not null/undefined.
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array of elements to search
   * @param getter - Optional property key or getter function to extract numeric values
   * @returns The element with the maximum value
   */
  transform<T, Key extends keyof T>(
    value: readonly T[],
    getter?: Key | ((item: T) => number)
  ): T;

  /**
   * Overload signature for null/undefined inputs that returns null.
   * Handles cases where the input might be null or undefined.
   * 
   * @param value - Null or undefined input
   * @returns Always returns null for null/undefined inputs
   */
  transform(value: null | undefined): null;

  /**
   * Main transform method that finds the element with the maximum value in an array.
   * 
   * Supports three modes of operation:
   * - **Primitive arrays**: When no getter is provided, treats array elements as numbers
   * - **Property extraction**: When a property key is provided, compares objects by that property
   * - **Custom computation**: When a function is provided, uses the function's return value for comparison
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array to search, or null/undefined
   * @param getter - Optional property key (string) or getter function to extract numeric values for comparison
   * @returns The element with the maximum value, or null if input is invalid/empty
   * 
   * @example
   * // Find maximum number in primitive array
   * pipe.transform([1, 5, 3, 9, 2]) // Returns: 9
   * 
   * @example
   * // Find user with maximum age using property key
   * const users = [
   *   { name: 'John', age: 25 },
   *   { name: 'Jane', age: 30 },
   *   { name: 'Bob', age: 28 }
   * ];
   * pipe.transform(users, 'age') // Returns: { name: 'Jane', age: 30 }
   * 
   * @example
   * // Find product with maximum total price using getter function
   * const products = [
   *   { name: 'Laptop', price: 1000, tax: 0.1 },
   *   { name: 'Phone', price: 500, tax: 0.08 }
   * ];
   * pipe.transform(products, p => p.price * (1 + p.tax)) 
   * // Returns: { name: 'Laptop', price: 1000, tax: 0.1 }
   */
  transform<T, Key extends keyof T>(
    value: readonly T[] | null | undefined,
    getter?: Key | ((item: T) => number)
  ): T | null {
    // Return null for invalid inputs (null, undefined, or non-arrays)
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    /**
     * Internal helper function that extracts numeric values for comparison.
     * Handles the three different modes of operation based on the getter parameter.
     * 
     * @param v - The array element to extract a numeric value from
     * @returns The numeric value to use for comparison
     */
    const get = (v: T) => {
      // Mode 3: Custom getter function provided
      if (typeof getter === 'function') {
        return getter(v);
      }
      
      // Mode 1: No getter provided, treat element as number (primitive array)
      if (getter === undefined) {
        return v as unknown as number;
      }
      
      // Mode 2: Property key provided, extract property value
      return v[getter as keyof T] as number;
    };

    // Use reduce to find the element with maximum value
    // Compare extracted numeric values and return the original element
    return value.reduce((a, b) => (get(a) >= get(b) ? a : b));
  }
}
