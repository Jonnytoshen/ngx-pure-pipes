/**
 * Unit tests for MeanPipe
 * 
 * Tests cover arithmetic mean (average) calculation functionality including:
 * - Basic mean calculation with primitive arrays
 * - Object arrays with property key extraction
 * - Object arrays with custom getter functions
 * - Null/undefined handling
 * - Edge cases and error scenarios
 * - Mathematical accuracy validation
 * - Type safety validation
 * - Performance with large datasets
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { MeanPipe } from './mean.pipe';

describe('MeanPipe', () => {
  let pipe: MeanPipe;

  beforeEach(() => {
    pipe = new MeanPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(MeanPipe);
    });
  });

  describe('primitive arrays', () => {
    it('should calculate mean of positive integers', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(3);
    });

    it('should calculate mean of decimal numbers', () => {
      const numbers = [1.5, 2.5, 3.5, 4.5];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(3.0);
    });

    it('should calculate mean of negative numbers', () => {
      const numbers = [-1, -2, -3, -4, -5];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(-3);
    });

    it('should calculate mean of mixed positive and negative numbers', () => {
      const numbers = [-10, -5, 0, 5, 10];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(0);
    });

    it('should handle array with zeros', () => {
      const numbers = [0, 0, 0, 0, 10];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(2);
    });

    it('should handle array with single element', () => {
      const numbers = [42];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(42);
    });

    it('should return null for empty array', () => {
      const numbers: number[] = [];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeNull();
    });

    it('should handle very large numbers', () => {
      const numbers = [1000000, 2000000, 3000000];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(2000000);
    });

    it('should handle very small decimal numbers', () => {
      const numbers = [0.001, 0.002, 0.003];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(0.002);
    });

    it('should handle scientific notation', () => {
      const numbers = [1e3, 2e3, 3e3]; // 1000, 2000, 3000
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(2000);
    });

    it('should calculate correct mean for odd number of elements', () => {
      const numbers = [2, 4, 6];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(4);
    });

    it('should calculate correct mean for even number of elements', () => {
      const numbers = [1, 2, 3, 4];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(2.5);
    });
  });

  describe('object arrays with property keys', () => {
    it('should calculate mean age from user objects', () => {
      const users = [
        { name: 'John', age: 20 },
        { name: 'Jane', age: 30 },
        { name: 'Bob', age: 40 }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toBe(30);
    });

    it('should calculate mean price from product objects', () => {
      const products = [
        { name: 'Laptop', price: 1000 },
        { name: 'Phone', price: 500 },
        { name: 'Tablet', price: 300 }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toBeCloseTo(600);
    });

    it('should calculate mean score from game results', () => {
      const scores = [
        { player: 'Alice', score: 85 },
        { player: 'Bob', score: 92 },
        { player: 'Charlie', score: 78 },
        { player: 'Diana', score: 95 }
      ];

      const result = pipe.transform(scores, 'score');

      expect(result).toBe(87.5);
    });

    it('should handle negative property values', () => {
      const transactions = [
        { id: 1, amount: 100 },
        { id: 2, amount: -50 },
        { id: 3, amount: 25 },
        { id: 4, amount: -25 }
      ];

      const result = pipe.transform(transactions, 'amount');

      expect(result).toBe(12.5);
    });

    it('should handle decimal property values', () => {
      const measurements = [
        { name: 'A', temperature: 23.5 },
        { name: 'B', temperature: 24.0 },
        { name: 'C', temperature: 22.5 }
      ];

      const result = pipe.transform(measurements, 'temperature');

      expect(result).toBeCloseTo(23.33, 2);
    });

    it('should handle zero property values', () => {
      const items = [
        { name: 'A', value: 10 },
        { name: 'B', value: 0 },
        { name: 'C', value: 20 }
      ];

      const result = pipe.transform(items, 'value');

      expect(result).toBe(10);
    });

    it('should return null for empty object array', () => {
      const emptyArray: Array<{ value: number }> = [];

      const result = pipe.transform(emptyArray, 'value');

      expect(result).toBeNull();
    });

    it('should handle single object', () => {
      const singleObject = [{ name: 'Test', value: 42 }];

      const result = pipe.transform(singleObject, 'value');

      expect(result).toBe(42);
    });
  });

  describe('object arrays with getter functions', () => {
    it('should calculate mean from computed values', () => {
      const rectangles = [
        { width: 2, height: 3 },
        { width: 4, height: 5 },
        { width: 1, height: 8 }
      ];

      const result = pipe.transform(rectangles, rect => rect.width * rect.height);

      // Areas: 6, 20, 8 -> Mean: 34/3 ≈ 11.33
      expect(result).toBeCloseTo(11.33, 2);
    });

    it('should calculate mean grade with weighted scores', () => {
      const students = [
        { homework: 80, exam: 90 },
        { homework: 90, exam: 85 },
        { homework: 75, exam: 95 }
      ];

      // Weighted: 60% homework + 40% exam
      const result = pipe.transform(students, student => 
        student.homework * 0.6 + student.exam * 0.4
      );

      // Expected individual scores: 84, 88, 83 -> Mean: 255/3 = 85
      const expected = 85;

      expect(result).toBeCloseTo(expected);
    });

    it('should calculate mean distance from origin', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 3, y: 4 },
        { x: 5, y: 12 }
      ];

      const result = pipe.transform(points, point => Math.sqrt(point.x ** 2 + point.y ** 2));

      // Distances: 0, 5, 13 -> Mean: 18/3 = 6
      expect(result).toBe(6);
    });

    it('should calculate mean profit from business data', () => {
      const businesses = [
        { revenue: 1000, expenses: 600 },
        { revenue: 1500, expenses: 900 },
        { revenue: 800, expenses: 500 }
      ];

      const result = pipe.transform(businesses, business => business.revenue - business.expenses);

      // Profits: 400, 600, 300 -> Mean: 1300/3 ≈ 433.33
      expect(result).toBeCloseTo(433.33, 2);
    });

    it('should handle complex nested calculations', () => {
      const orders = [
        { items: [{ price: 10, quantity: 2 }], tax: 0.1 },
        { items: [{ price: 15, quantity: 1 }, { price: 5, quantity: 3 }], tax: 0.08 },
        { items: [{ price: 8, quantity: 4 }], tax: 0.12 }
      ];

      const result = pipe.transform(orders, order => {
        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return subtotal * (1 + order.tax);
      });

      const order1 = 20 * 1.1;  // 22
      const order2 = 30 * 1.08; // 32.4
      const order3 = 32 * 1.12; // 35.84
      const expected = (order1 + order2 + order3) / 3;

      expect(result).toBeCloseTo(expected);
    });

    it('should handle getter functions returning negative values', () => {
      const data = [
        { income: 1000, expenses: 1200 },
        { income: 800, expenses: 600 },
        { income: 1200, expenses: 1100 }
      ];

      const result = pipe.transform(data, item => item.income - item.expenses);

      // Net: -200, 200, 100 -> Mean: 100/3 ≈ 33.33
      expect(result).toBeCloseTo(33.33, 2);
    });

    it('should handle mathematical functions', () => {
      const numbers = [
        { value: 4 },
        { value: 9 },
        { value: 16 }
      ];

      const result = pipe.transform(numbers, item => Math.sqrt(item.value));

      // Square roots: 2, 3, 4 -> Mean: 9/3 = 3
      expect(result).toBe(3);
    });
  });

  describe('null and undefined handling', () => {
    it('should return null when input array is null', () => {
      const result = pipe.transform(null);

      expect(result).toBeNull();
    });

    it('should return null when input array is undefined', () => {
      const result = pipe.transform(undefined);

      expect(result).toBeNull();
    });

    it('should return null when input is not an array', () => {
      const result = pipe.transform('not-an-array' as unknown as never[]);

      expect(result).toBeNull();
    });

    it('should return null when input is a number', () => {
      const result = pipe.transform(123 as unknown as never[]);

      expect(result).toBeNull();
    });

    it('should return null when input is an object', () => {
      const result = pipe.transform({ key: 'value' } as unknown as never[]);

      expect(result).toBeNull();
    });
  });

  describe('immutability and purity', () => {
    it('should not modify the original array', () => {
      const originalNumbers = [1, 2, 3, 4, 5];
      const numbers = [...originalNumbers];

      pipe.transform(numbers);

      expect(numbers).toEqual(originalNumbers);
    });

    it('should not modify original objects in array', () => {
      const originalUsers = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 }
      ];
      const users = [...originalUsers];

      pipe.transform(users, 'age');

      expect(users).toEqual(originalUsers);
    });

    it('should be pure and stateless', () => {
      const numbers1 = [1, 2, 3];
      const numbers2 = [4, 5, 6];

      const result1 = pipe.transform(numbers1);
      const result2 = pipe.transform(numbers2);
      const result3 = pipe.transform(numbers1);

      expect(result1).toBe(2);
      expect(result2).toBe(5);
      expect(result3).toBe(2);
      expect(result1).toEqual(result3);
    });
  });

  describe('mathematical accuracy', () => {
    it('should handle floating point precision correctly', () => {
      const numbers = [0.1, 0.2, 0.3];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(0.2, 10);
    });

    it('should handle very precise decimal calculations', () => {
      const numbers = [1.111111, 2.222222, 3.333333];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(2.222222, 6);
    });

    it('should handle division resulting in repeating decimals', () => {
      const numbers = [1, 2, 3];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(2, 10);
    });

    it('should handle numbers with many decimal places', () => {
      const numbers = [1.123456789, 2.987654321, 3.456789012];
      
      const result = pipe.transform(numbers);
      
      const expected = (1.123456789 + 2.987654321 + 3.456789012) / 3;
      expect(result).toBeCloseTo(expected, 9);
    });
  });

  describe('performance and large datasets', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i + 1);

      const start = performance.now();
      const result = pipe.transform(largeArray);
      const end = performance.now();

      // Mean of 1 to 100000 = (1 + 100000) / 2 = 50000.5
      expect(result).toBe(50000.5);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle large object arrays with property keys', () => {
      const largeObjectArray = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: i + 1,
        category: `category${i % 10}`
      }));

      const start = performance.now();
      const result = pipe.transform(largeObjectArray, 'value');
      const end = performance.now();

      // Mean of 1 to 10000 = (1 + 10000) / 2 = 5000.5
      expect(result).toBe(5000.5);
      expect(end - start).toBeLessThan(50);
    });

    it('should handle complex getter functions efficiently', () => {
      const complexArray = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        data: { x: i, y: i * 2, z: i * 3 }
      }));

      const start = performance.now();
      const result = pipe.transform(complexArray, item => 
        Math.sqrt(item.data.x ** 2 + item.data.y ** 2 + item.data.z ** 2)
      );
      const end = performance.now();

      expect(result).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('type safety', () => {
    it('should work with strongly typed interfaces', () => {
      interface Student {
        id: number;
        name: string;
        grade: number;
        isActive: boolean;
      }

      const students: Student[] = [
        { id: 1, name: 'John', grade: 85, isActive: true },
        { id: 2, name: 'Jane', grade: 92, isActive: false },
        { id: 3, name: 'Bob', grade: 78, isActive: true }
      ];

      const result = pipe.transform(students, 'grade');

      expect(result).toBeCloseTo(85);
      // TypeScript should infer result as number | null
      expect(typeof result).toBe('number');
    });

    it('should maintain type information with getter functions', () => {
      interface Product {
        id: number;
        name: string;
        price: number;
        rating: number;
      }

      const products: Product[] = [
        { id: 1, name: 'Laptop', price: 999, rating: 4.5 },
        { id: 2, name: 'Phone', price: 599, rating: 4.8 },
        { id: 3, name: 'Tablet', price: 399, rating: 4.2 }
      ];

      const result = pipe.transform(products, product => product.price * product.rating);

      // TypeScript should maintain proper typing
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('real-world scenarios', () => {
    it('should calculate average test scores', () => {
      const testScores = [
        { student: 'Alice', score: 95 },
        { student: 'Bob', score: 87 },
        { student: 'Charlie', score: 92 },
        { student: 'Diana', score: 88 }
      ];

      const result = pipe.transform(testScores, 'score');

      expect(result).toBe(90.5);
    });

    it('should calculate average product ratings', () => {
      const products = [
        { name: 'Product A', rating: 4.5 },
        { name: 'Product B', rating: 3.8 },
        { name: 'Product C', rating: 4.2 },
        { name: 'Product D', rating: 4.0 }
      ];

      const result = pipe.transform(products, 'rating');

      expect(result).toBeCloseTo(4.125);
    });

    it('should calculate average daily temperatures', () => {
      const temperatures = [
        { date: '2024-01-01', celsius: 22.5 },
        { date: '2024-01-02', celsius: 25.0 },
        { date: '2024-01-03', celsius: 19.8 },
        { date: '2024-01-04', celsius: 23.2 }
      ];

      const result = pipe.transform(temperatures, 'celsius');

      expect(result).toBeCloseTo(22.625);
    });

    it('should calculate average order values', () => {
      const orders = [
        { id: 1, items: [{ price: 25, quantity: 2 }] },
        { id: 2, items: [{ price: 15, quantity: 3 }, { price: 10, quantity: 1 }] },
        { id: 3, items: [{ price: 30, quantity: 1 }] }
      ];

      const result = pipe.transform(orders, order => 
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );

      // Order totals: 50, 55, 30 -> Mean: 135/3 = 45
      expect(result).toBe(45);
    });

    it('should calculate average employee performance scores', () => {
      const employees = [
        { name: 'John', performance: { quality: 4.2, speed: 3.8, collaboration: 4.5 } },
        { name: 'Jane', performance: { quality: 4.8, speed: 4.2, collaboration: 4.0 } },
        { name: 'Bob', performance: { quality: 3.9, speed: 4.1, collaboration: 4.3 } }
      ];

      const result = pipe.transform(employees, emp => 
        (emp.performance.quality + emp.performance.speed + emp.performance.collaboration) / 3
      );

      const john = (4.2 + 3.8 + 4.5) / 3;   // 4.167
      const jane = (4.8 + 4.2 + 4.0) / 3;   // 4.333
      const bob = (3.9 + 4.1 + 4.3) / 3;    // 4.1
      const expected = (john + jane + bob) / 3;

      expect(result).toBeCloseTo(expected, 3);
    });

    it('should calculate average monthly expenses', () => {
      const expenses = [
        { month: 'Jan', amount: 2500 },
        { month: 'Feb', amount: 2800 },
        { month: 'Mar', amount: 2200 },
        { month: 'Apr', amount: 2600 }
      ];

      const result = pipe.transform(expenses, 'amount');

      expect(result).toBe(2525);
    });

    it('should calculate average response times', () => {
      const apiCalls = [
        { endpoint: '/api/users', responseTime: 120 },
        { endpoint: '/api/orders', responseTime: 95 },
        { endpoint: '/api/products', responseTime: 180 },
        { endpoint: '/api/stats', responseTime: 210 }
      ];

      const result = pipe.transform(apiCalls, 'responseTime');

      expect(result).toBeCloseTo(151.25);
    });
  });
});
