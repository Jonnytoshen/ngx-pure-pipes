import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that calculates the arithmetic mean (average) of numeric values in an array.
 * 
 * This pure pipe provides three modes of operation:
 * 1. For primitive arrays (numbers): Calculates the average of all numeric values directly
 * 2. For object arrays with property key: Calculates the average of values from the specified property
 * 3. For object arrays with getter function: Calculates the average of computed values returned by the getter function
 * 
 * The pipe is immutable and does not modify the original array.
 * Empty arrays and invalid inputs return null.
 * 
 * @example
 * // Template usage with primitive array
 * {{ [2, 4, 6, 8] | mean }} // Returns: 5
 * 
 * @example
 * // Template usage with object array and property key
 * {{ students | mean:'grade' }} // Returns: average grade of all students
 * 
 * @example
 * // Template usage with getter function
 * {{ products | mean:calculateScore }} // Returns: average computed score
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'mean',
})
export class MeanPipe implements PipeTransform {
  /**
   * Overload signature for non-null arrays that guarantees a numeric return value.
   * Used when TypeScript can determine the input array is definitely not null/undefined.
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array of elements to calculate the mean from
   * @param getter - Optional property key or getter function to extract numeric values
   * @returns The arithmetic mean (average) of all extracted numeric values
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
   * Main transform method that calculates the arithmetic mean (average) of numeric values in an array.
   * 
   * Supports three modes of operation:
   * - **Primitive arrays**: When no getter is provided, treats array elements as numbers and calculates their average
   * - **Property extraction**: When a property key is provided, extracts values from that property and calculates the average
   * - **Custom computation**: When a function is provided, computes values using the function and calculates the average
   * 
   * The calculation uses the standard arithmetic mean formula: (sum of all values) / (count of values)
   * 
   * @template T - The type of elements in the array
   * @template Key - The type of the property key (must be a key of T)
   * @param value - The input array to calculate the mean from, or null/undefined
   * @param getter - Optional property key (string) or getter function to extract numeric values for calculation
   * @returns The arithmetic mean of all extracted numeric values, or null if input is invalid/empty
   * 
   * @example
   * // Calculate mean of numbers in primitive array
   * pipe.transform([1, 2, 3, 4, 5]) // Returns: 3
   * 
   * @example
   * // Calculate average age using property key
   * const users = [
   *   { name: 'John', age: 25 },
   *   { name: 'Jane', age: 30 },
   *   { name: 'Bob', age: 35 }
   * ];
   * pipe.transform(users, 'age') // Returns: 30
   * 
   * @example
   * // Calculate average score using getter function
   * const students = [
   *   { homework: 85, exam: 90 },
   *   { homework: 92, exam: 88 },
   *   { homework: 78, exam: 95 }
   * ];
   * pipe.transform(students, student => (student.homework + student.exam) / 2)
   * // Returns: average of individual student averages
   * 
   * @example
   * // Empty array returns null
   * pipe.transform([]) // Returns: null
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
    // Return null for invalid inputs (null, undefined, or non-arrays) and empty arrays
    if (!Array.isArray(value) || value.length === 0) {
      return null;
    }

    /**
     * Internal helper function that extracts numeric values for mean calculation.
     * Handles the three different modes of operation based on the getter parameter.
     * 
     * @param v - The array element to extract a numeric value from
     * @returns The numeric value to include in the mean calculation
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

    // Calculate the sum of all extracted numeric values
    const total = value.reduce((acc, item) => acc + get(item), 0);
    
    // Return the arithmetic mean: total sum divided by count of elements
    return total / value.length;
  }
}
