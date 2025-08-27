/**
 * Unit tests for utility functions in check.ts
 * 
 * Tests cover type checking functions used throughout the ngx-pure-pipes library.
 * Each function is tested for correct behavior with various input types and edge cases.
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { isNil, isRegExp } from './helpers';

describe('check utilities', () => {
  describe('isNil', () => {
    describe('should return true for nil values', () => {
      it('should return true for null', () => {
        expect(isNil(null)).toBe(true);
      });

      it('should return true for undefined', () => {
        expect(isNil(undefined)).toBe(true);
      });

      it('should return true for explicitly undefined variable', () => {
        let undefinedVar: unknown;
        expect(isNil(undefinedVar)).toBe(true);
      });
    });

    describe('should return false for non-nil values', () => {
      it('should return false for empty string', () => {
        expect(isNil('')).toBe(false);
      });

      it('should return false for zero', () => {
        expect(isNil(0)).toBe(false);
      });

      it('should return false for false boolean', () => {
        expect(isNil(false)).toBe(false);
      });

      it('should return false for NaN', () => {
        expect(isNil(NaN)).toBe(false);
      });

      it('should return false for empty array', () => {
        expect(isNil([])).toBe(false);
      });

      it('should return false for empty object', () => {
        expect(isNil({})).toBe(false);
      });

      it('should return false for string values', () => {
        expect(isNil('hello')).toBe(false);
        expect(isNil('0')).toBe(false);
        expect(isNil(' ')).toBe(false);
      });

      it('should return false for number values', () => {
        expect(isNil(1)).toBe(false);
        expect(isNil(-1)).toBe(false);
        expect(isNil(3.14)).toBe(false);
        expect(isNil(Infinity)).toBe(false);
        expect(isNil(-Infinity)).toBe(false);
      });

      it('should return false for boolean values', () => {
        expect(isNil(true)).toBe(false);
      });

      it('should return false for function values', () => {
        const emptyArrowFn = () => { /* empty */ };
        const emptyFunction = function() { /* empty */ };
        
        expect(isNil(emptyArrowFn)).toBe(false);
        expect(isNil(emptyFunction)).toBe(false);
        expect(isNil(isNil)).toBe(false);
      });

      it('should return false for array values', () => {
        expect(isNil([1, 2, 3])).toBe(false);
        expect(isNil(['a', 'b'])).toBe(false);
      });

      it('should return false for object values', () => {
        expect(isNil({ key: 'value' })).toBe(false);
        expect(isNil(new Date())).toBe(false);
        expect(isNil(/regex/)).toBe(false);
      });
    });

    describe('type narrowing behavior', () => {
      it('should properly narrow types in conditional blocks', () => {
        const value: string | null | undefined = 'test';
        
        if (!isNil(value)) {
          // TypeScript should know value is string here
          expect(typeof value).toBe('string');
          expect(value.length).toBe(4);
        }
      });

      it('should work with union types', () => {
        const values: (string | null | undefined)[] = ['hello', null, undefined, 'world'];
        const nonNilValues = values.filter(v => !isNil(v));
        
        expect(nonNilValues).toEqual(['hello', 'world']);
        // TypeScript should infer nonNilValues as string[]
        nonNilValues.forEach(v => {
          expect(typeof v).toBe('string');
        });
      });
    });
  });

  describe('isRegExp', () => {
    describe('should return true for RegExp objects', () => {
      it('should return true for literal regex', () => {
        expect(isRegExp(/test/)).toBe(true);
        expect(isRegExp(/test/g)).toBe(true);
        expect(isRegExp(/test/i)).toBe(true);
        expect(isRegExp(/test/gi)).toBe(true);
        expect(isRegExp(/test/gim)).toBe(true);
      });

      it('should return true for RegExp constructor', () => {
        expect(isRegExp(new RegExp('test'))).toBe(true);
        expect(isRegExp(new RegExp('test', 'g'))).toBe(true);
        expect(isRegExp(new RegExp('test', 'i'))).toBe(true);
        expect(isRegExp(new RegExp('test', 'gi'))).toBe(true);
      });

      it('should return true for complex regex patterns', () => {
        expect(isRegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)).toBe(true);
        expect(isRegExp(/\d{3}-\d{2}-\d{4}/)).toBe(true);
        expect(isRegExp(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/)).toBe(true);
      });

      it('should return true for empty regex', () => {
        expect(isRegExp(new RegExp(''))).toBe(true);
        expect(isRegExp(/(?:)/)).toBe(true);
      });
    });

    describe('should return false for non-RegExp values', () => {
      it('should return false for null and undefined', () => {
        expect(isRegExp(null)).toBe(false);
        expect(isRegExp(undefined)).toBe(false);
      });

      it('should return false for string values', () => {
        expect(isRegExp('')).toBe(false);
        expect(isRegExp('test')).toBe(false);
        expect(isRegExp('/test/')).toBe(false);
        expect(isRegExp('/test/g')).toBe(false);
        expect(isRegExp('regex')).toBe(false);
      });

      it('should return false for number values', () => {
        expect(isRegExp(0)).toBe(false);
        expect(isRegExp(1)).toBe(false);
        expect(isRegExp(-1)).toBe(false);
        expect(isRegExp(3.14)).toBe(false);
        expect(isRegExp(NaN)).toBe(false);
        expect(isRegExp(Infinity)).toBe(false);
      });

      it('should return false for boolean values', () => {
        expect(isRegExp(true)).toBe(false);
        expect(isRegExp(false)).toBe(false);
      });

      it('should return false for array values', () => {
        expect(isRegExp([])).toBe(false);
        expect(isRegExp([1, 2, 3])).toBe(false);
        expect(isRegExp(['test'])).toBe(false);
      });

      it('should return false for object values', () => {
        expect(isRegExp({})).toBe(false);
        expect(isRegExp({ test: 'value' })).toBe(false);
        expect(isRegExp(new Date())).toBe(false);
        expect(isRegExp(new Error())).toBe(false);
      });

      it('should return false for function values', () => {
        const emptyArrowFn = () => { /* empty */ };
        const emptyFunction = function() { /* empty */ };
        
        expect(isRegExp(emptyArrowFn)).toBe(false);
        expect(isRegExp(emptyFunction)).toBe(false);
        expect(isRegExp(isRegExp)).toBe(false);
        expect(isRegExp(RegExp)).toBe(false);
      });

      it('should return false for objects with regex-like properties', () => {
        const fakeRegex = {
          source: 'test',
          flags: 'g',
          test: () => true,
          exec: () => null
        };
        expect(isRegExp(fakeRegex)).toBe(false);
      });
    });

    describe('type narrowing behavior', () => {
      it('should properly narrow types in conditional blocks', () => {
        const value: unknown = /test/;
        
        if (isRegExp(value)) {
          // TypeScript should know value is RegExp here
          expect(value.source).toBe('test');
          expect(value.flags).toBe('');
          expect(typeof value.test).toBe('function');
        }
      });

      it('should work with union types', () => {
        const values: (string | RegExp | number)[] = ['hello', /test/, 42, /world/i];
        const regexValues = values.filter(isRegExp);
        
        expect(regexValues).toHaveLength(2);
        // TypeScript should infer regexValues as RegExp[]
        regexValues.forEach(regex => {
          expect(typeof regex.source).toBe('string');
          expect(typeof regex.flags).toBe('string');
        });
      });
    });

    describe('edge cases', () => {
      it('should handle RegExp with special flags correctly', () => {
        expect(isRegExp(/test/gim)).toBe(true);
        expect(isRegExp(new RegExp('test', 'gim'))).toBe(true);
      });

      it('should distinguish RegExp from objects with similar structure', () => {
        const regexLikeObject = {
          source: 'test',
          flags: 'g',
          global: true,
          test: () => true
        };
        expect(isRegExp(regexLikeObject)).toBe(false);
      });
    });
  });
});
