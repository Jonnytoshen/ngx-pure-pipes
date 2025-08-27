import { Pipe, PipeTransform } from '@angular/core';
import { isNil, isRegExp } from '../utils/check';

/**
 * Template string interpolation pipe
 *
 * Replaces placeholders in template strings with values from a variables object.
 * Uses double curly braces syntax {{variable}} by default, with support for custom regex patterns.
 *
 * @example
 * ```typescript
 * // Basic usage in template
 * template | template:variables
 *
 * // Simple variable replacement
 * 'Hello {{name}}!' | template:{ name: 'World' }
 * // Result: 'Hello World!'
 *
 * // Multiple variables
 * '{{greeting}} {{name}}, you have {{count}} messages' | template:{
 *   greeting: 'Hi',
 *   name: 'John',
 *   count: 5
 * }
 * // Result: 'Hi John, you have 5 messages'
 *
 * // Custom regex pattern
 * 'Hello ${name}!' | template:{ name: 'World' }:/\$\{(.+?)\}/g
 * // Result: 'Hello World!'
 *
 * // Missing variables keep original placeholder
 * 'Hello {{name}} and {{unknown}}!' | template:{ name: 'World' }
 * // Result: 'Hello World and {{unknown}}!'
 * ```
 *
 * @author ngx-pure-pipes
 * @since 1.0.0
 */
@Pipe({
  name: 'template',
})
export class TemplatePipe implements PipeTransform {
  /**
   * Performs variable replacement on a string template
   *
   * @param template - The template string to process
   * @param variables - Object containing replacement variables
   * @param regex - Optional custom regex pattern for matching placeholders
   * @returns The string with variables replaced
   */
  transform(
    template: string,
    variables: Record<string, unknown>,
    regex?: RegExp
  ): string;

  /**
   * Overload for handling null or undefined template strings
   *
   * @param template - null or undefined value
   * @param variables - Object containing replacement variables
   * @param regex - Optional custom regex pattern
   * @returns null
   */
  transform(
    template: null | undefined,
    variables: Record<string, unknown>,
    regex?: RegExp
  ): null;

  /**
   * Main implementation for template string variable replacement
   *
   * @param template - The template string to process, can be null or undefined
   * @param variables - Key-value pairs object containing replacement variables
   * @param regex - Optional custom regex pattern, defaults to /\{\{(.+?)\}\}/g
   * @returns The processed string with variables replaced, or null if input is null/undefined
   */
  transform(
    template: string | null | undefined,
    variables: Record<string, unknown>,
    regex?: RegExp
  ): string | null {
    // Return null immediately if template is null or undefined
    if (isNil(template)) {
      return null;
    }

    // Use default double curly braces pattern if no custom regex provided
    if (!isRegExp(regex)) {
      regex = /\{\{(.+?)\}\}/g;
    }

    // Replace placeholders using regex pattern
    // match: the full matched string (e.g., "{{name}}")
    // key: the captured group with variable name (e.g., "name")
    return template.replace(regex, (match, key) => {
      // Return variable value if exists, otherwise keep original placeholder
      // Use String() to ensure return value is a string type
      return String(variables[key] ?? match);
    });
  }
}
