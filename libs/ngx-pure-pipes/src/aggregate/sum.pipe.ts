import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that calculates the sum of numeric values in an array.
 * 
 * This pure pipe provides three modes of operation:
 * 1. For primitive arrays (numbers): Sums all numeric values directly
 * 2. For object arrays with property key: Sums values from the specified property of each object
 * 3. For object arrays with getter function: Sums computed values returned by the getter function
 * 
 * The pipe is immutable and does not modify the original array.
 * Empty arrays return 0, while invalid inputs return null.
 * 
 * @example
 * // Template usage with primitive array
 * {{ [5, 2, 8, 1, 9] | sum }} // Returns: 25
 * 
 * @example
 * // Template usage with object array and property key
 * {{ products | sum:'price' }} // Returns: sum of all product prices
 * 
 * @example
 * // Template usage with getter function
 * {{ orders | sum:calculateTotal }} // Returns: sum of computed totals
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'sum',
})
export class SumPipe implements PipeTransform {
  /**
   * Overload signature for non-null arrays that guarantees a numeric return value.
   * Used when TypeScript can determine the input array is definitely not null/undefined.
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array of elements to sum
   * @param getter - Optional property key or getter function to extract numeric values
   * @returns The sum of all extracted numeric values
   */
  transform<T, Key extends keyof T>(
    value: readonly T[],
    getter?: Key | ((item: T) => number)
  ): number;

  /**
   * Overload signature for null/undefined inputs that returns null.
   * Handles cases where the input might be null or undefined.
   * 
   * @param value - Null or undefined input
   * @returns Always returns null for null/undefined inputs
   */
  transform(value: null | undefined): null;

  /**
   * Main transform method that calculates the sum of numeric values in an array.
   * 
   * Supports three modes of operation:
   * - **Primitive arrays**: When no getter is provided, treats array elements as numbers and sums them directly
   * - **Property extraction**: When a property key is provided, extracts and sums values from that property
   * - **Custom computation**: When a function is provided, computes values using the function and sums the results
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array to sum, or null/undefined
   * @param getter - Optional property key (string) or getter function to extract numeric values for summation
   * @returns The sum of all extracted numeric values, or null if input is invalid
   * 
   * @example
   * // Sum numbers in primitive array
   * pipe.transform([1, 2, 3, 4, 5]) // Returns: 15
   * 
   * @example
   * // Sum property values from object array
   * const products = [
   *   { name: 'Laptop', price: 999.99 },
   *   { name: 'Phone', price: 599.99 },
   *   { name: 'Tablet', price: 399.99 }
   * ];
   * pipe.transform(products, 'price') // Returns: 1999.97
   * 
   * @example
   * // Sum computed values using getter function
   * const orders = [
   *   { quantity: 2, unitPrice: 10.50, tax: 0.08 },
   *   { quantity: 1, unitPrice: 25.00, tax: 0.08 },
   *   { quantity: 3, unitPrice: 5.75, tax: 0.08 }
   * ];
   * pipe.transform(orders, order => order.quantity * order.unitPrice * (1 + order.tax))
   * // Returns: sum of all order totals including tax
   * 
   * @example
   * // Empty array returns 0
   * pipe.transform([]) // Returns: 0
   * 
   * @example
   * // Invalid input returns null
   * pipe.transform(null) // Returns: null
   * pipe.transform(undefined) // Returns: null
   */
  transform<T, Key extends keyof T>(
    value: readonly T[] | null | undefined,
    getter?: Key | ((item: T) => number)
  ): number | null {
    // Return null for invalid inputs (null, undefined, or non-arrays)
    if (!Array.isArray(value)) {
      return null;
    }

    /**
     * Internal helper function that extracts numeric values for summation.
     * Handles the three different modes of operation based on the getter parameter.
     * 
     * @param v - The array element to extract a numeric value from
     * @returns The numeric value to add to the sum
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
      return v[getter] as unknown as number;
    };

    // Use reduce to accumulate the sum of all extracted numeric values
    // Start with 0 as the initial accumulator value
    return value.reduce((acc, item) => acc + get(item), 0);
  }
}
