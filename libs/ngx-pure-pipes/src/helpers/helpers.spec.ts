/**
 * Unit tests for utility functions in helpers.ts
 * 
 * Tests cover utility functions used throughout the ngx-pure-pipes library.
 * Each function is tested for correct behavior with various input types and edge cases.
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { isNil, isRegExp, round, isNumber } from './helpers';

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

  describe('round', () => {
    describe('basic rounding functionality', () => {
      it('should round to nearest integer by default', () => {
        expect(round(3.14159)).toBe(3);
        expect(round(3.7)).toBe(4);
        expect(round(3.5)).toBe(4);
        expect(round(2.5)).toBe(3);
      });

      it('should handle negative numbers correctly', () => {
        expect(round(-3.14159)).toBe(-3);
        expect(round(-3.7)).toBe(-4);
        expect(round(-3.5)).toBe(-3);
        expect(round(-2.5)).toBe(-2);
      });

      it('should return the same number for integers', () => {
        expect(round(5)).toBe(5);
        expect(round(0)).toBe(0);
        expect(round(-10)).toBe(-10);
        expect(round(1000)).toBe(1000);
      });

      it('should handle zero correctly', () => {
        expect(round(0)).toBe(0);
        expect(round(0.0)).toBe(0);
        expect(round(-0.0)).toBe(0);
        expect(round(0.4)).toBe(0);
        expect(round(0.6)).toBe(1);
      });
    });

    describe('precision-based rounding', () => {
      it('should round to 1 decimal place', () => {
        expect(round(3.14159, 1)).toBe(3.1);
        expect(round(3.16, 1)).toBe(3.2);
        expect(round(3.15, 1)).toBe(3.2);
        expect(round(3.14, 1)).toBe(3.1);
      });

      it('should round to 2 decimal places', () => {
        expect(round(3.14159, 2)).toBe(3.14);
        expect(round(3.146, 2)).toBe(3.15);
        expect(round(3.145, 2)).toBe(3.15);
        expect(round(3.144, 2)).toBe(3.14);
      });

      it('should round to 3 decimal places', () => {
        expect(round(3.14159, 3)).toBe(3.142);
        expect(round(3.1416, 3)).toBe(3.142);
        expect(round(3.1415, 3)).toBe(3.142);
        expect(round(3.1414, 3)).toBe(3.141);
      });

      it('should round to 4 decimal places', () => {
        expect(round(3.14159, 4)).toBe(3.1416);
        expect(round(3.141592, 4)).toBe(3.1416);
        expect(round(3.141594, 4)).toBe(3.1416);
        expect(round(3.141593, 4)).toBe(3.1416);
      });

      it('should handle high precision values', () => {
        expect(round(3.141592653589793, 5)).toBe(3.14159);
        expect(round(3.141592653589793, 8)).toBe(3.14159265);
        expect(round(3.141592653589793, 10)).toBe(3.1415926536);
      });
    });

    describe('edge cases and special values', () => {
      it('should handle negative precision by defaulting to integer rounding', () => {
        expect(round(3.14159, -1)).toBe(3);
        expect(round(3.7, -5)).toBe(4);
        expect(round(-3.14159, -2)).toBe(-3);
        expect(round(0.6, -10)).toBe(1);
      });

      it('should handle zero precision explicitly', () => {
        expect(round(3.14159, 0)).toBe(3);
        expect(round(3.7, 0)).toBe(4);
        expect(round(-3.14159, 0)).toBe(-3);
      });

      it('should handle very large numbers', () => {
        expect(round(1000000.123456, 2)).toBe(1000000.12);
        expect(round(999999999.876543, 3)).toBe(999999999.877);
        expect(round(1e10 + 0.12345, 4)).toBe(10000000000.1235);
      });

      it('should handle very small numbers', () => {
        expect(round(0.000001, 6)).toBe(0.000001);
        expect(round(0.0000012345, 8)).toBe(0.00000123);
        expect(round(0.00000156789, 7)).toBe(0.0000016);
      });

      it('should handle scientific notation', () => {
        expect(round(1e-5, 6)).toBe(0.00001);
        expect(round(1.23e-4, 5)).toBe(0.00012);
        expect(round(9.87e3, 1)).toBe(9870.0);
      });

      it('should handle infinity values', () => {
        expect(round(Infinity)).toBe(Infinity);
        expect(round(-Infinity)).toBe(-Infinity);
        expect(round(Infinity, 2)).toBe(Infinity);
        expect(round(-Infinity, 5)).toBe(-Infinity);
      });

      it('should handle NaN values', () => {
        expect(round(NaN)).toBeNaN();
        expect(round(NaN, 2)).toBeNaN();
        expect(round(NaN, -1)).toBeNaN();
      });
    });

    describe('floating-point precision issues', () => {
      it('should handle floating-point arithmetic correctly', () => {
        // Common floating-point issues
        expect(round(0.1 + 0.2, 1)).toBe(0.3);
        expect(round(0.1 + 0.2, 10)).toBe(0.3);
        expect(round(1.005, 2)).toBe(1.01);
        expect(round(1.235, 2)).toBe(1.24);
      });

      it('should handle decimal boundary cases', () => {
        expect(round(1.999999999999, 2)).toBe(2.0);
        expect(round(0.999999999999, 3)).toBe(1.0);
        expect(round(2.9999999999999996, 1)).toBe(3.0);
      });

      it('should maintain precision for exact decimal representations', () => {
        expect(round(1.25, 1)).toBe(1.3);
        expect(round(1.35, 1)).toBe(1.4);
        expect(round(1.45, 1)).toBe(1.5);
        expect(round(1.55, 1)).toBe(1.6);
      });
    });

    describe('financial and business calculations', () => {
      it('should handle currency calculations correctly', () => {
        // Price with tax calculations
        expect(round(19.95 * 1.08, 2)).toBe(21.55);
        expect(round(99.99 * 1.0825, 2)).toBe(108.24);
        expect(round(15.67 * 1.06, 2)).toBe(16.61);
      });

      it('should handle percentage calculations', () => {
        expect(round(100 * 0.075, 2)).toBe(7.5);
        expect(round(1000 * 0.0325, 2)).toBe(32.5);
        expect(round(250 * 0.15, 2)).toBe(37.5);
      });

      it('should handle discount calculations', () => {
        expect(round(100 * 0.85, 2)).toBe(85.0);
        expect(round(299.99 * 0.8, 2)).toBe(239.99);
        expect(round(50.00 * 0.75, 2)).toBe(37.5);
      });

      it('should handle interest calculations', () => {
        // Simple interest: P * r * t
        expect(round(1000 * 0.05 * 1, 2)).toBe(50.0);
        expect(round(5000 * 0.0375 * 2, 2)).toBe(375.0);
        expect(round(10000 * 0.025 * 0.5, 2)).toBe(125.0);
      });
    });

    describe('scientific and measurement calculations', () => {
      it('should handle physical constants with appropriate precision', () => {
        const pi = 3.141592653589793;
        expect(round(pi, 2)).toBe(3.14);
        expect(round(pi, 4)).toBe(3.1416);
        expect(round(pi, 6)).toBe(3.141593);
      });

      it('should handle conversion calculations', () => {
        // Temperature conversions
        expect(round((32 - 32) * 5/9, 1)).toBe(0.0); // F to C
        expect(round(100 * 9/5 + 32, 1)).toBe(212.0); // C to F
        
        // Distance conversions
        expect(round(100 * 0.621371, 3)).toBe(62.137); // km to miles
        expect(round(50 * 1.60934, 2)).toBe(80.47); // miles to km
      });

      it('should handle area and volume calculations', () => {
        const radius = 5.5;
        const pi = 3.141592653589793;
        
        // Circle area: π * r²
        expect(round(pi * radius * radius, 2)).toBe(95.03);
        
        // Sphere volume: (4/3) * π * r³
        expect(round((4/3) * pi * radius * radius * radius, 2)).toBe(696.91);
      });
    });

    describe('performance considerations', () => {
      it('should handle large datasets efficiently', () => {
        const testValues = Array.from({ length: 1000 }, (_, i) => i * 0.123456789);
        
        const start = performance.now();
        testValues.forEach(value => round(value, 3));
        const end = performance.now();
        
        expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
      });

      it('should maintain consistent performance across different precisions', () => {
        const testValue = 123.456789012345;
        const precisions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        const start = performance.now();
        precisions.forEach(precision => {
          for (let i = 0; i < 100; i++) {
            round(testValue, precision);
          }
        });
        const end = performance.now();
        
        expect(end - start).toBeLessThan(20); // Should complete efficiently
      });
    });

    describe('type safety and parameter validation', () => {
      it('should work with integer inputs', () => {
        expect(round(5, 2)).toBe(5.0);
        expect(round(10, 1)).toBe(10.0);
        expect(round(-3, 3)).toBe(-3.0);
      });

      it('should work with decimal inputs', () => {
        expect(round(3.14159, 2)).toBe(3.14);
        expect(round(-2.71828, 3)).toBe(-2.718);
        expect(round(0.123456, 4)).toBe(0.1235);
      });

      it('should handle default precision parameter', () => {
        expect(round(3.14159)).toBe(3);
        expect(round(3.7)).toBe(4);
        expect(round(-3.14159)).toBe(-3);
      });

      it('should handle explicit zero precision', () => {
        expect(round(3.14159, 0)).toBe(3);
        expect(round(3.7, 0)).toBe(4);
        expect(round(-3.14159, 0)).toBe(-3);
      });
    });

    describe('real-world use cases', () => {
      it('should format display values correctly', () => {
        // User interface display values
        expect(round(3.141592653589793, 2)).toBe(3.14); // π for display
        expect(round(2.718281828459045, 3)).toBe(2.718); // e for display
        expect(round(1.4142135623730951, 4)).toBe(1.4142); // √2 for display
      });

      it('should handle statistical calculations', () => {
        // Mean calculation with rounding
        const values = [1.234, 2.567, 3.891, 4.123];
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        expect(round(mean, 3)).toBe(2.954);
      });

      it('should handle data analysis scenarios', () => {
        // Standard deviation calculation (simplified)
        const data = [10.1, 12.3, 11.7, 9.8, 13.2];
        const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);
        
        expect(round(mean, 2)).toBe(11.42);
        expect(round(variance, 3)).toBe(1.678);
        expect(round(stdDev, 3)).toBe(1.295);
      });

      it('should handle graphics and animation calculations', () => {
        // Bezier curve calculations
        const t = 0.3;
        const p0 = 0, p1 = 50, p2 = 100;
        const bezierValue = (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
        
        expect(round(bezierValue, 1)).toBe(30.0);
      });
    });
  });

  describe('isNumber', () => {
    describe('should return true for valid numbers', () => {
      it('should return true for positive integers', () => {
        expect(isNumber(1)).toBe(true);
        expect(isNumber(42)).toBe(true);
        expect(isNumber(1000)).toBe(true);
        expect(isNumber(999999)).toBe(true);
      });

      it('should return true for negative integers', () => {
        expect(isNumber(-1)).toBe(true);
        expect(isNumber(-42)).toBe(true);
        expect(isNumber(-1000)).toBe(true);
        expect(isNumber(-999999)).toBe(true);
      });

      it('should return true for zero', () => {
        expect(isNumber(0)).toBe(true);
        expect(isNumber(-0)).toBe(true);
        expect(isNumber(+0)).toBe(true);
      });

      it('should return true for decimal numbers', () => {
        expect(isNumber(3.14)).toBe(true);
        expect(isNumber(-2.71)).toBe(true);
        expect(isNumber(0.5)).toBe(true);
        expect(isNumber(1.23456789)).toBe(true);
      });

      it('should return true for very small decimal numbers', () => {
        expect(isNumber(0.000001)).toBe(true);
        expect(isNumber(-0.000001)).toBe(true);
        expect(isNumber(Number.MIN_VALUE)).toBe(true);
        expect(isNumber(Number.EPSILON)).toBe(true);
      });

      it('should return true for very large numbers', () => {
        expect(isNumber(Number.MAX_VALUE)).toBe(true);
        expect(isNumber(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(isNumber(Number.MIN_SAFE_INTEGER)).toBe(true);
        expect(isNumber(1e20)).toBe(true);
      });

      it('should return true for scientific notation', () => {
        expect(isNumber(1e10)).toBe(true);
        expect(isNumber(1e-10)).toBe(true);
        expect(isNumber(2.5e5)).toBe(true);
        expect(isNumber(-3.7e-8)).toBe(true);
      });

      it('should return true for Infinity values', () => {
        expect(isNumber(Infinity)).toBe(true);
        expect(isNumber(-Infinity)).toBe(true);
        expect(isNumber(Number.POSITIVE_INFINITY)).toBe(true);
        expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(true);
      });

      it('should return true for numbers created with Number constructor', () => {
        expect(isNumber(Number(42))).toBe(true);
        expect(isNumber(Number('3.14'))).toBe(true);
        expect(isNumber(Number(true))).toBe(true); // Number(true) = 1
        expect(isNumber(Number(false))).toBe(true); // Number(false) = 0
      });

      it('should return true for mathematical operation results', () => {
        expect(isNumber(2 + 3)).toBe(true);
        expect(isNumber(10 / 2)).toBe(true);
        expect(isNumber(Math.PI)).toBe(true);
        expect(isNumber(Math.E)).toBe(true);
        expect(isNumber(Math.sqrt(16))).toBe(true);
      });
    });

    describe('should return false for NaN', () => {
      it('should return false for NaN literal', () => {
        expect(isNumber(NaN)).toBe(false);
        expect(isNumber(Number.NaN)).toBe(false);
      });

      it('should return false for operations resulting in NaN', () => {
        expect(isNumber(0 / 0)).toBe(false);
        expect(isNumber(Infinity - Infinity)).toBe(false);
        expect(isNumber(Math.sqrt(-1))).toBe(false);
        expect(isNumber(parseInt('abc'))).toBe(false);
        expect(isNumber(parseFloat('not-a-number'))).toBe(false);
      });

      it('should return false for Number constructor with invalid input', () => {
        expect(isNumber(Number('abc'))).toBe(false);
        expect(isNumber(Number(undefined))).toBe(false);
        expect(isNumber(Number({}))).toBe(false);
      });
    });

    describe('should return false for non-number types', () => {
      it('should return false for strings', () => {
        expect(isNumber('42')).toBe(false);
        expect(isNumber('3.14')).toBe(false);
        expect(isNumber('hello')).toBe(false);
        expect(isNumber('')).toBe(false);
        expect(isNumber('0')).toBe(false);
        expect(isNumber('NaN')).toBe(false);
        expect(isNumber('Infinity')).toBe(false);
      });

      it('should return false for booleans', () => {
        expect(isNumber(true)).toBe(false);
        expect(isNumber(false)).toBe(false);
      });

      it('should return false for null and undefined', () => {
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
      });

      it('should return false for objects', () => {
        expect(isNumber({})).toBe(false);
        expect(isNumber({ value: 42 })).toBe(false);
        expect(isNumber(new Object())).toBe(false);
        expect(isNumber(new Date())).toBe(false);
      });

      it('should return false for arrays', () => {
        expect(isNumber([])).toBe(false);
        expect(isNumber([1, 2, 3])).toBe(false);
        expect(isNumber([42])).toBe(false);
      });

      it('should return false for functions', () => {
        expect(isNumber(() => 42)).toBe(false);
        expect(isNumber(function() { return 42; })).toBe(false);
        expect(isNumber(Math.max)).toBe(false);
        expect(isNumber(Number)).toBe(false);
      });

      it('should return false for symbols', () => {
        expect(isNumber(Symbol('test'))).toBe(false);
        expect(isNumber(Symbol.iterator)).toBe(false);
      });

      it('should return false for BigInt', () => {
        expect(isNumber(BigInt(42))).toBe(false);
      });

      it('should return false for regex', () => {
        expect(isNumber(/\d+/)).toBe(false);
        expect(isNumber(new RegExp('\\d+'))).toBe(false);
      });

      it('should return false for Map and Set', () => {
        expect(isNumber(new Map())).toBe(false);
        expect(isNumber(new Set())).toBe(false);
        expect(isNumber(new WeakMap())).toBe(false);
        expect(isNumber(new WeakSet())).toBe(false);
      });
    });

    describe('type guard functionality', () => {
      it('should work as a type guard in TypeScript', () => {
        const mixedValues: unknown[] = [42, '42', null, 3.14, NaN, true, {}, []];
        
        const numbers = mixedValues.filter(isNumber);
        
        // TypeScript should infer numbers as number[]
        expect(numbers).toEqual([42, 3.14]);
        expect(numbers.every(n => typeof n === 'number' && !Number.isNaN(n))).toBe(true);
      });

      it('should enable type-safe operations after validation', () => {
        const testValue: unknown = 42;
        
        if (isNumber(testValue)) {
          // TypeScript should know testValue is number here
          const doubled = testValue * 2;
          const fixed = testValue.toFixed(2);
          
          expect(doubled).toBe(84);
          expect(fixed).toBe('42.00');
        } else {
          fail('Expected testValue to be a number');
        }
      });

      it('should work with conditional logic', () => {
        const processValue = (value: unknown): string => {
          return isNumber(value) ? value.toString() : 'not a number';
        };

        expect(processValue(42)).toBe('42');
        expect(processValue(3.14)).toBe('3.14');
        expect(processValue('42')).toBe('not a number');
        expect(processValue(NaN)).toBe('not a number');
        expect(processValue(null)).toBe('not a number');
      });
    });

    describe('edge cases and special scenarios', () => {
      it('should handle boxed numbers correctly', () => {
        // Note: boxed numbers (new Number()) are objects, not primitives
        expect(isNumber(new Number(42))).toBe(false);
        expect(isNumber(new Number(3.14))).toBe(false);
        expect(isNumber(new Number(NaN))).toBe(false);
      });

      it('should handle numeric strings consistently', () => {
        expect(isNumber('42')).toBe(false);
        expect(isNumber('3.14')).toBe(false);
        expect(isNumber('0')).toBe(false);
        expect(isNumber('-42')).toBe(false);
        expect(isNumber('1e10')).toBe(false);
      });

      it('should handle coercion scenarios', () => {
        // Values that could be coerced to numbers but aren't numbers
        expect(isNumber('')).toBe(false); // Number('') = 0
        expect(isNumber('   ')).toBe(false); // Number('   ') = 0
        expect(isNumber(true)).toBe(false); // Number(true) = 1
        expect(isNumber(false)).toBe(false); // Number(false) = 0
        expect(isNumber([])).toBe(false); // Number([]) = 0
      });

      it('should handle prototype pollution scenarios', () => {
        const obj = Object.create(null);
        obj.valueOf = () => 42;
        obj.toString = () => '42';
        
        expect(isNumber(obj)).toBe(false);
      });
    });

    describe('performance considerations', () => {
      it('should handle large datasets efficiently', () => {
        const mixedArray = Array.from({ length: 10000 }, (_, i) => {
          if (i % 4 === 0) return i;
          if (i % 4 === 1) return `${i}`;
          if (i % 4 === 2) return null;
          return { value: i };
        });

        const start = performance.now();
        const numbers = mixedArray.filter(isNumber);
        const end = performance.now();

        expect(numbers.length).toBe(2500); // 1/4 of the array
        expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
        expect(numbers.every(n => typeof n === 'number' && !Number.isNaN(n))).toBe(true);
      });

      it('should maintain consistent performance across different types', () => {
        const testValues = [
          42, '42', true, null, undefined, {}, [], NaN, Infinity,
          Symbol('test'), /regex/, new Date(), Math.max, new Map()
        ];

        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
          testValues.forEach(isNumber);
        }
        const end = performance.now();

        expect(end - start).toBeLessThan(100); // Should complete efficiently
      });
    });

    describe('real-world use cases', () => {
      it('should validate form input values', () => {
        const formInputs = ['42', '3.14', 'abc', '', null, undefined, 42];
        
        const validNumbers = formInputs
          .map(input => typeof input === 'string' ? parseFloat(input) : input)
          .filter(isNumber);
        
        expect(validNumbers).toEqual([42, 3.14, 42]);
      });

      it('should filter arrays for mathematical operations', () => {
        const mixedData = [1, '2', 3, null, 4.5, 'hello', 6, undefined, NaN];
        
        const numbers = mixedData.filter(isNumber);
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        
        expect(numbers).toEqual([1, 3, 4.5, 6]);
        expect(sum).toBe(14.5);
      });

      it('should validate API response data', () => {
        const apiResponse = {
          id: 123,
          name: 'Product',
          price: '29.99', // String from API
          rating: 4.5,
          reviews: null,
          discount: undefined
        };

        const numericFields = Object.values(apiResponse).filter(isNumber);
        
        expect(numericFields).toEqual([123, 4.5]);
      });

      it('should work in pipe implementations', () => {
        // Simulating a pipe that only processes numbers
        const pipeTransform = (value: unknown, multiplier: unknown): number | null => {
          if (!isNumber(value) || !isNumber(multiplier)) {
            return null;
          }
          return value * multiplier;
        };

        expect(pipeTransform(5, 2)).toBe(10);
        expect(pipeTransform('5', 2)).toBeNull();
        expect(pipeTransform(5, '2')).toBeNull();
        expect(pipeTransform(NaN, 2)).toBeNull();
      });

      it('should validate calculation inputs', () => {
        const calculateTotal = (values: unknown[]): number => {
          const validNumbers = values.filter(isNumber);
          return validNumbers.reduce((sum, num) => sum + num, 0);
        };

        const inputs = [10, '20', 30, null, 40.5, NaN, 'hello'];
        expect(calculateTotal(inputs)).toBe(80.5);
      });

      it('should handle statistical data processing', () => {
        const dataset = [1.2, 2.3, 'invalid', 3.4, null, 4.5, NaN, 5.6];
        
        const validData = dataset.filter(isNumber);
        const mean = validData.reduce((sum, val) => sum + val, 0) / validData.length;
        
        expect(validData).toEqual([1.2, 2.3, 3.4, 4.5, 5.6]);
        expect(mean).toBeCloseTo(3.4);
      });
    });
  });
});
