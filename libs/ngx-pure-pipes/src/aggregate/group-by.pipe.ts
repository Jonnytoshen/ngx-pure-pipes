import { Pipe, PipeTransform } from '@angular/core';

/**
 * GroupBy aggregation pipe
 *
 * Groups array elements by a specified property key, creating an object where
 * each key represents a unique property value and its corresponding value is
 * an array of items that share that property value.
 *
 * @example
 * ```typescript
 * // Basic usage in template
 * items | groupBy:'category'
 *
 * // Group users by status
 * const users = [
 *   { name: 'John', status: 'active' },
 *   { name: 'Jane', status: 'inactive' },
 *   { name: 'Bob', status: 'active' }
 * ];
 * users | groupBy:'status'
 * // Result: {
 * //   active: [{ name: 'John', status: 'active' }, { name: 'Bob', status: 'active' }],
 * //   inactive: [{ name: 'Jane', status: 'inactive' }]
 * // }
 *
 * // Group products by category
 * products | groupBy:'category'
 *
 * // Use with keyValue pipe for iteration
 * @for (group of items | groupBy:'type' | keyValue; track group.key) {
 *   <div>
 *     <h3>{{ group.key }}</h3>
 *     <p>{{ group.value.length }} items</p>
 *   </div>
 * }
 *
 * // Group by numeric property
 * scores | groupBy:'grade'
 * // Result groups by grade values: { 85: [...], 90: [...], 95: [...] }
 * ```
 *
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'groupBy',
})
export class GroupByPipe implements PipeTransform {
  /**
   * Groups array elements by a specified property key
   *
   * @param value - The array to group
   * @param groupKey - The property key to group by
   * @returns An object with grouped arrays, where keys are property values
   */
  transform<T, Key extends keyof T>(
    value: readonly T[],
    groupKey: Key
  ): { [K in string | number | symbol]: T[] };

  /**
   * Overload for handling null or undefined arrays
   *
   * @param value - null or undefined value
   * @param groupKey - The property key to group by
   * @returns null
   */
  transform(value: null | undefined, groupKey: string | number | symbol): null;

  /**
   * Main implementation for grouping array elements by property
   *
   * Creates a new object where each key represents a unique value from the
   * specified property, and the corresponding value is an array containing
   * all items that have that property value.
   *
   * @param value - The array to group, can be null or undefined
   * @param groupKey - The property key to use for grouping
   * @returns Grouped object with arrays of items, or null if input is invalid
   */
  transform<T, Key extends keyof T>(
    value: readonly T[] | null | undefined,
    groupKey: Key
  ): { [K in string | number | symbol]: T[] } | null {
    // Return null immediately if value is not a valid array
    if (!Array.isArray(value)) {
      return null;
    }

    // Use reduce to build the grouped object
    // For each item, extract the grouping key value and add item to corresponding group
    return value.reduce((groups, item) => {
      const key = item[groupKey];

      // Create new group if it doesn't exist, otherwise add to existing group
      // Use spread operator to maintain immutability
      const currentGroup = !groups[key] ? [item] : [...groups[key], item];

      return {
        ...groups,
        [key]: currentGroup,
      };
    }, {} as { [K in string | number | symbol]: T[] });
  }
}
