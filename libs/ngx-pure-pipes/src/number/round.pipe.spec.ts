/**
 * Unit tests for RoundPipe
 * 
 * Tests cover numeric rounding functionality including:
 * - Basic rounding with default integer precision
 * - Decimal place rounding with various precision levels
 * - Null/undefined input handling
 * - Edge cases and special numeric values
 * - Mathematical accuracy validation
 * - Type safety verification
 * - Performance with various numeric inputs
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { RoundPipe } from './round.pipe';

describe('RoundPipe', () => {
  let pipe: RoundPipe;

  beforeEach(() => {
    pipe = new RoundPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(RoundPipe);
    });
  });

  describe('basic rounding (default precision)', () => {
    it('should round positive numbers to nearest integer', () => {
      expect(pipe.transform(3.14159)).toBe(3);
      expect(pipe.transform(3.7)).toBe(4);
      expect(pipe.transform(3.5)).toBe(4);
      expect(pipe.transform(2.5)).toBe(3);
      expect(pipe.transform(1.1)).toBe(1);
      expect(pipe.transform(1.9)).toBe(2);
    });

    it('should round negative numbers to nearest integer', () => {
      expect(pipe.transform(-3.14159)).toBe(-3);
      expect(pipe.transform(-3.7)).toBe(-4);
      expect(pipe.transform(-3.5)).toBe(-3);
      expect(pipe.transform(-2.5)).toBe(-2);
      expect(pipe.transform(-1.1)).toBe(-1);
      expect(pipe.transform(-1.9)).toBe(-2);
    });

    it('should handle zero values correctly', () => {
      expect(pipe.transform(0)).toBe(0);
      expect(pipe.transform(0.0)).toBe(0);
      expect(pipe.transform(-0.0)).toBe(0);
      expect(pipe.transform(0.4)).toBe(0);
      expect(pipe.transform(0.6)).toBe(1);
      expect(pipe.transform(-0.4)).toBe(0);
      expect(pipe.transform(-0.6)).toBe(-1);
    });

    it('should return integers unchanged', () => {
      expect(pipe.transform(5)).toBe(5);
      expect(pipe.transform(-10)).toBe(-10);
      expect(pipe.transform(0)).toBe(0);
      expect(pipe.transform(1000)).toBe(1000);
      expect(pipe.transform(-999)).toBe(-999);
    });
  });

  describe('precision-based rounding', () => {
    it('should round to 1 decimal place', () => {
      expect(pipe.transform(3.14159, 1)).toBe(3.1);
      expect(pipe.transform(3.16, 1)).toBe(3.2);
      expect(pipe.transform(3.15, 1)).toBe(3.2);
      expect(pipe.transform(3.14, 1)).toBe(3.1);
      expect(pipe.transform(-2.76, 1)).toBe(-2.8);
      expect(pipe.transform(-2.74, 1)).toBe(-2.7);
    });

    it('should round to 2 decimal places', () => {
      expect(pipe.transform(3.14159, 2)).toBe(3.14);
      expect(pipe.transform(3.146, 2)).toBe(3.15);
      expect(pipe.transform(3.145, 2)).toBe(3.15);
      expect(pipe.transform(3.144, 2)).toBe(3.14);
      expect(pipe.transform(-1.236, 2)).toBe(-1.24);
      expect(pipe.transform(-1.234, 2)).toBe(-1.23);
    });

    it('should round to 3 decimal places', () => {
      expect(pipe.transform(3.14159, 3)).toBe(3.142);
      expect(pipe.transform(3.1416, 3)).toBe(3.142);
      expect(pipe.transform(3.1415, 3)).toBe(3.142);
      expect(pipe.transform(3.1414, 3)).toBe(3.141);
      expect(pipe.transform(-2.7183, 3)).toBe(-2.718);
    });

    it('should round to 4 decimal places', () => {
      expect(pipe.transform(3.14159, 4)).toBe(3.1416);
      expect(pipe.transform(3.141592, 4)).toBe(3.1416);
      expect(pipe.transform(3.141594, 4)).toBe(3.1416);
      expect(pipe.transform(3.141593, 4)).toBe(3.1416);
      expect(pipe.transform(-2.71828, 4)).toBe(-2.7183);
    });

    it('should handle high precision values', () => {
      expect(pipe.transform(3.141592653589793, 5)).toBe(3.14159);
      expect(pipe.transform(3.141592653589793, 8)).toBe(3.14159265);
      expect(pipe.transform(3.141592653589793, 10)).toBe(3.1415926536);
      expect(pipe.transform(2.718281828459045, 6)).toBe(2.718282);
    });

    it('should handle zero precision explicitly', () => {
      expect(pipe.transform(3.14159, 0)).toBe(3);
      expect(pipe.transform(3.7, 0)).toBe(4);
      expect(pipe.transform(-3.14159, 0)).toBe(-3);
      expect(pipe.transform(-3.7, 0)).toBe(-4);
    });
  });

  describe('financial calculations', () => {
    it('should handle currency calculations with tax', () => {
      expect(pipe.transform(19.95 * 1.08, 2)).toBe(21.55);
      expect(pipe.transform(99.99 * 1.0825, 2)).toBe(108.24);
      expect(pipe.transform(15.67 * 1.06, 2)).toBe(16.61);
      expect(pipe.transform(250.00 * 1.075, 2)).toBe(268.75);
    });

    it('should handle percentage calculations', () => {
      expect(pipe.transform(100 * 0.075, 2)).toBe(7.5);
      expect(pipe.transform(1000 * 0.0325, 2)).toBe(32.5);
      expect(pipe.transform(250 * 0.15, 2)).toBe(37.5);
      expect(pipe.transform(500 * 0.18, 2)).toBe(90.0);
    });

    it('should handle discount calculations', () => {
      expect(pipe.transform(100 * 0.85, 2)).toBe(85.0);
      expect(pipe.transform(299.99 * 0.8, 2)).toBe(239.99);
      expect(pipe.transform(50.00 * 0.75, 2)).toBe(37.5);
      expect(pipe.transform(199.95 * 0.9, 2)).toBe(179.96);
    });

    it('should handle interest calculations', () => {
      expect(pipe.transform(1000 * 0.05 * 1, 2)).toBe(50.0);
      expect(pipe.transform(5000 * 0.0375 * 2, 2)).toBe(375.0);
      expect(pipe.transform(10000 * 0.025 * 0.5, 2)).toBe(125.0);
      expect(pipe.transform(2500 * 0.06 * 1.5, 2)).toBe(225.0);
    });
  });

  describe('edge cases and special values', () => {
    it('should handle very large numbers', () => {
      expect(pipe.transform(1000000.123456, 2)).toBe(1000000.12);
      expect(pipe.transform(999999999.876543, 3)).toBe(999999999.877);
      expect(pipe.transform(Number.MAX_SAFE_INTEGER, 0)).toBe(Number.MAX_SAFE_INTEGER);
      expect(pipe.transform(1e10 + 0.12345, 4)).toBe(10000000000.1235);
    });

    it('should handle very small numbers', () => {
      expect(pipe.transform(0.000001, 6)).toBe(0.000001);
      expect(pipe.transform(0.0000012345, 8)).toBe(0.00000123);
      expect(pipe.transform(0.00000156789, 7)).toBe(0.0000016);
      expect(pipe.transform(Number.MIN_VALUE, 10)).toBe(0);
    });

    it('should handle scientific notation', () => {
      expect(pipe.transform(1e-5, 6)).toBe(0.00001);
      expect(pipe.transform(1.23e-4, 5)).toBe(0.00012);
      expect(pipe.transform(9.87e3, 1)).toBe(9870.0);
      expect(pipe.transform(2.5e6, 0)).toBe(2500000);
    });

    it('should handle Infinity values', () => {
      expect(pipe.transform(Infinity)).toBe(Infinity);
      expect(pipe.transform(-Infinity)).toBe(-Infinity);
      expect(pipe.transform(Infinity, 2)).toBe(Infinity);
      expect(pipe.transform(-Infinity, 5)).toBe(-Infinity);
    });

    it('should handle negative precision gracefully', () => {
      expect(pipe.transform(3.14159, -1)).toBe(3);
      expect(pipe.transform(3.7, -5)).toBe(4);
      expect(pipe.transform(-3.14159, -2)).toBe(-3);
      expect(pipe.transform(0.6, -10)).toBe(1);
    });
  });

  describe('null and undefined handling', () => {
    it('should return null for null input', () => {
      expect(pipe.transform(null)).toBeNull();
      expect(pipe.transform(null, 2)).toBeNull();
      expect(pipe.transform(null, 0)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(pipe.transform(undefined)).toBeNull();
      expect(pipe.transform(undefined, 2)).toBeNull();
      expect(pipe.transform(undefined, 0)).toBeNull();
    });

    it('should return null for NaN input', () => {
      expect(pipe.transform(NaN)).toBeNull();
      expect(pipe.transform(NaN, 2)).toBeNull();
      expect(pipe.transform(0 / 0, 3)).toBeNull();
      expect(pipe.transform(Math.sqrt(-1), 1)).toBeNull();
    });

    it('should return null for non-numeric inputs', () => {
      expect(pipe.transform('42' as unknown as number)).toBeNull();
      expect(pipe.transform('3.14' as unknown as number, 2)).toBeNull();
      expect(pipe.transform(true as unknown as number)).toBeNull();
      expect(pipe.transform({} as unknown as number, 1)).toBeNull();
      expect(pipe.transform([] as unknown as number)).toBeNull();
    });
  });

  describe('floating-point precision issues', () => {
    it('should handle floating-point arithmetic correctly', () => {
      expect(pipe.transform(0.1 + 0.2, 1)).toBe(0.3);
      expect(pipe.transform(0.1 + 0.2, 10)).toBe(0.3);
      expect(pipe.transform(1.005, 2)).toBe(1.01);
      expect(pipe.transform(1.235, 2)).toBe(1.24);
    });

    it('should handle decimal boundary cases', () => {
      expect(pipe.transform(1.999999999999, 2)).toBe(2.0);
      expect(pipe.transform(0.999999999999, 3)).toBe(1.0);
      expect(pipe.transform(2.9999999999999996, 1)).toBe(3.0);
      expect(pipe.transform(4.999999999999999, 0)).toBe(5);
    });

    it('should maintain precision for exact decimal representations', () => {
      expect(pipe.transform(1.25, 1)).toBe(1.3);
      expect(pipe.transform(1.35, 1)).toBe(1.4);
      expect(pipe.transform(1.45, 1)).toBe(1.5);
      expect(pipe.transform(1.55, 1)).toBe(1.6);
    });
  });

  describe('mathematical constants and operations', () => {
    it('should handle mathematical constants correctly', () => {
      expect(pipe.transform(Math.PI, 2)).toBe(3.14);
      expect(pipe.transform(Math.PI, 4)).toBe(3.1416);
      expect(pipe.transform(Math.E, 3)).toBe(2.718);
      expect(pipe.transform(Math.SQRT2, 4)).toBe(1.4142);
      expect(pipe.transform(Math.LN10, 3)).toBe(2.303);
    });

    it('should handle mathematical operations', () => {
      expect(pipe.transform(Math.sqrt(16), 1)).toBe(4.0);
      expect(pipe.transform(Math.pow(2, 10), 0)).toBe(1024);
      expect(pipe.transform(Math.sin(Math.PI / 2), 0)).toBe(1);
      expect(pipe.transform(Math.cos(0), 1)).toBe(1.0);
    });

    it('should handle trigonometric calculations', () => {
      expect(pipe.transform(Math.sin(Math.PI / 6), 1)).toBe(0.5);
      expect(pipe.transform(Math.cos(Math.PI / 3), 1)).toBe(0.5);
      expect(pipe.transform(Math.tan(Math.PI / 4), 0)).toBe(1);
    });
  });

  describe('performance considerations', () => {
    it('should handle multiple calculations efficiently', () => {
      const testValues = Array.from({ length: 1000 }, (_, i) => i * 0.123456789);
      
      const start = performance.now();
      testValues.forEach(value => pipe.transform(value, 3));
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
    });

    it('should maintain consistent performance across different precisions', () => {
      const testValue = 123.456789012345;
      const precisions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      const start = performance.now();
      precisions.forEach(precision => {
        for (let i = 0; i < 100; i++) {
          pipe.transform(testValue, precision);
        }
      });
      const end = performance.now();
      
      expect(end - start).toBeLessThan(20); // Should complete efficiently
    });
  });

  describe('type safety', () => {
    it('should work with different numeric types', () => {
      expect(pipe.transform(42, 2)).toBe(42.0);
      expect(pipe.transform(3.14159, 2)).toBe(3.14);
      expect(pipe.transform(-17.5, 1)).toBe(-17.5);
      expect(pipe.transform(0, 3)).toBe(0.0);
    });

    it('should handle method overload scenarios', () => {
      // Test the overload that guarantees number return
      const result1: number = pipe.transform(3.14159, 2);
      expect(result1).toBe(3.14);
      
      // Test the overload that returns null for null input
      const result2: null = pipe.transform(null, 2);
      expect(result2).toBeNull();
    });
  });

  describe('real-world scenarios', () => {
    it('should format prices correctly', () => {
      expect(pipe.transform(19.99, 2)).toBe(19.99);
      expect(pipe.transform(19.999, 2)).toBe(20.0);
      expect(pipe.transform(29.995, 2)).toBe(30.0);
      expect(pipe.transform(99.9, 2)).toBe(99.9);
    });

    it('should handle percentage displays', () => {
      expect(pipe.transform(15.678, 1)).toBe(15.7);
      expect(pipe.transform(0.125 * 100, 1)).toBe(12.5);
      expect(pipe.transform(0.08333 * 100, 2)).toBe(8.33);
      expect(pipe.transform(0.1666 * 100, 1)).toBe(16.7);
    });

    it('should format statistical data', () => {
      const values = [1.234, 2.567, 3.891, 4.123];
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      expect(pipe.transform(mean, 2)).toBe(2.95);
      expect(pipe.transform(mean, 3)).toBe(2.954);
    });

    it('should handle measurement conversions', () => {
      // Temperature conversions
      expect(pipe.transform((32 - 32) * 5/9, 1)).toBe(0.0); // F to C
      expect(pipe.transform(100 * 9/5 + 32, 1)).toBe(212.0); // C to F
      
      // Distance conversions
      expect(pipe.transform(100 * 0.621371, 2)).toBe(62.14); // km to miles
      expect(pipe.transform(50 * 1.60934, 1)).toBe(80.5); // miles to km
    });

    it('should format chart data points', () => {
      const dataPoints = [12.3456, 45.6789, 78.9012, 23.4567];
      
      const rounded = dataPoints.map(point => pipe.transform(point, 1));
      
      expect(rounded).toEqual([12.3, 45.7, 78.9, 23.5]);
    });

    it('should handle scientific calculations', () => {
      // Physics calculations
      const gravity = 9.80665;
      const velocity = Math.sqrt(2 * gravity * 10); // Free fall from 10m
      
      expect(pipe.transform(velocity, 2)).toBe(14);
      expect(pipe.transform(gravity, 1)).toBe(9.8);
    });

    it('should format financial reports', () => {
      const revenue = 123456.789;
      const expenses = 98765.432;
      const profit = revenue - expenses;
      
      expect(pipe.transform(revenue, 2)).toBe(123456.79);
      expect(pipe.transform(expenses, 2)).toBe(98765.43);
      expect(pipe.transform(profit, 2)).toBe(24691.36);
    });

    it('should handle game score calculations', () => {
      const baseScore = 1234.567;
      const multiplier = 1.5;
      const bonus = 100.123;
      const finalScore = baseScore * multiplier + bonus;
      
      expect(pipe.transform(finalScore, 0)).toBe(1952);
      expect(pipe.transform(finalScore, 2)).toBe(1951.97);
    });
  });
});
