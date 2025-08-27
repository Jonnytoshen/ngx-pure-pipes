/**
 * Unit tests for MaxPipe
 * 
 * Tests cover maximum value finding functionality including:
 * - Basic maximum finding with primitive arrays
 * - Object arrays with property key extraction
 * - Object arrays with custom getter functions
 * - Null/undefined handling
 * - Edge cases and error scenarios
 * - Type safety validation
 * - Performance with large datasets
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { MaxPipe } from './max.pipe';

describe('MaxPipe', () => {
  let pipe: MaxPipe;

  beforeEach(() => {
    pipe = new MaxPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(MaxPipe);
    });
  });

  describe('primitive arrays', () => {
    it('should find maximum in number array', () => {
      const numbers = [5, 2, 8, 1, 9];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(9);
    });

    it('should handle array with one element', () => {
      const numbers = [42];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(42);
    });

    it('should handle array with negative numbers', () => {
      const numbers = [-5, -2, -8, -10, -3];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(-2);
    });

    it('should handle array with mixed positive and negative numbers', () => {
      const numbers = [-5, 2, -8, 10, -3];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(10);
    });

    it('should handle array with decimal numbers', () => {
      const numbers = [3.14, 2.71, 4.89, 2.23];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(4.89);
    });

    it('should handle array with zero', () => {
      const numbers = [-5, 0, -3, -2];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(0);
    });

    it('should handle array with duplicate maximum values', () => {
      const numbers = [5, 9, 3, 9, 4];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(9);
    });

    it('should handle array with all same values', () => {
      const numbers = [7, 7, 7, 7];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(7);
    });

    it('should handle very large numbers', () => {
      const numbers = [1000000, 999999, 1000001, 500000];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(1000001);
    });
  });

  describe('object arrays with property keys', () => {
    it('should find object with maximum numeric property', () => {
      const users = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 22 },
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 27 }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toEqual({ name: 'Bob', age: 30 });
    });

    it('should find product with maximum price', () => {
      const products = [
        { name: 'Laptop', price: 999.99 },
        { name: 'Phone', price: 599.99 },
        { name: 'Tablet', price: 399.99 },
        { name: 'Watch', price: 1299.99 }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toEqual({ name: 'Watch', price: 1299.99 });
    });

    it('should handle objects with duplicate maximum values', () => {
      const items = [
        { id: 1, score: 85 },
        { id: 2, score: 95 },
        { id: 3, score: 95 },
        { id: 4, score: 90 }
      ];

      const result = pipe.transform(items, 'score');

      expect(result).toEqual({ id: 2, score: 95 });
    });

    it('should handle objects with negative property values', () => {
      const data = [
        { name: 'A', value: -15 },
        { name: 'B', value: -10 },
        { name: 'C', value: -20 },
        { name: 'D', value: -5 }
      ];

      const result = pipe.transform(data, 'value');

      expect(result).toEqual({ name: 'D', value: -5 });
    });

    it('should handle objects with decimal property values', () => {
      const measurements = [
        { name: 'A', temperature: 23.5 },
        { name: 'B', temperature: 18.2 },
        { name: 'C', temperature: 25.1 },
        { name: 'D', temperature: 17.8 }
      ];

      const result = pipe.transform(measurements, 'temperature');

      expect(result).toEqual({ name: 'C', temperature: 25.1 });
    });

    it('should handle objects with zero values', () => {
      const items = [
        { name: 'A', value: -5 },
        { name: 'B', value: 0 },
        { name: 'C', value: -3 }
      ];

      const result = pipe.transform(items, 'value');

      expect(result).toEqual({ name: 'B', value: 0 });
    });
  });

  describe('object arrays with getter functions', () => {
    it('should find object with maximum computed value', () => {
      const products = [
        { name: 'Laptop', basePrice: 1000, tax: 0.08 },
        { name: 'Phone', basePrice: 800, tax: 0.1 },
        { name: 'Tablet', basePrice: 600, tax: 0.12 }
      ];

      const result = pipe.transform(products, item => item.basePrice * (1 + item.tax));

      expect(result).toEqual({ name: 'Laptop', basePrice: 1000, tax: 0.08 });
    });

    it('should handle complex calculations', () => {
      const students = [
        { name: 'John', homework: 85, exam: 90, attendance: 95 },
        { name: 'Jane', homework: 92, exam: 88, attendance: 98 },
        { name: 'Bob', homework: 78, exam: 95, attendance: 90 }
      ];

      // Calculate weighted average: 40% homework, 50% exam, 10% attendance
      const result = pipe.transform(students, student => 
        student.homework * 0.4 + student.exam * 0.5 + student.attendance * 0.1
      );

      expect(result).toEqual({ name: 'Jane', homework: 92, exam: 88, attendance: 98 });
    });

    it('should handle getter functions returning negative values', () => {
      const data = [
        { name: 'A', x: -5, y: 3 },
        { name: 'B', x: -2, y: -4 },
        { name: 'C', x: -1, y: -8 }
      ];

      const result = pipe.transform(data, item => item.x * item.y);

      expect(result).toEqual({ name: 'B', x: -2, y: -4 });
    });

    it('should handle getter functions with complex object properties', () => {
      const employees = [
        { name: 'John', salary: { base: 50000, bonus: 5000 } },
        { name: 'Jane', salary: { base: 60000, bonus: 8000 } },
        { name: 'Bob', salary: { base: 55000, bonus: 3000 } }
      ];

      const result = pipe.transform(employees, emp => emp.salary.base + emp.salary.bonus);

      const janeTotal = 60000 + 8000; // 68000
      const johnTotal = 50000 + 5000; // 55000
      const bobTotal = 55000 + 3000;  // 58000

      expect(janeTotal).toBeGreaterThan(johnTotal);
      expect(janeTotal).toBeGreaterThan(bobTotal);
      expect(result).toEqual({ name: 'Jane', salary: { base: 60000, bonus: 8000 } });
    });

    it('should handle mathematical functions', () => {
      const points = [
        { name: 'A', x: 3, y: 4 },
        { name: 'B', x: 1, y: 1 },
        { name: 'C', x: 5, y: 12 }
      ];

      // Calculate distance from origin using Pythagorean theorem
      const result = pipe.transform(points, point => Math.sqrt(point.x ** 2 + point.y ** 2));

      expect(result).toEqual({ name: 'C', x: 5, y: 12 });
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

  describe('empty arrays', () => {
    it('should return null for empty array', () => {
      const result = pipe.transform([]);

      expect(result).toBeNull();
    });

    it('should return null for empty array with property key', () => {
      const result = pipe.transform([], 'age');

      expect(result).toBeNull();
    });

    it('should return null for empty array with getter function', () => {
      const result = pipe.transform([], (item: unknown) => (item as { value: number }).value);

      expect(result).toBeNull();
    });
  });

  describe('immutability and purity', () => {
    it('should not modify the original array', () => {
      const originalNumbers = [5, 2, 8, 1, 9];
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

      const result = pipe.transform(users, 'age');

      expect(users).toEqual(originalUsers);
      expect(result).toBe(users[1]); // Should return reference to original object
    });

    it('should be pure and stateless', () => {
      const numbers1 = [5, 2, 8];
      const numbers2 = [3, 7, 1];

      const result1 = pipe.transform(numbers1);
      const result2 = pipe.transform(numbers2);
      const result3 = pipe.transform(numbers1);

      expect(result1).toBe(8);
      expect(result2).toBe(7);
      expect(result3).toBe(8);
      expect(result1).toEqual(result3);
    });
  });

  describe('performance and large datasets', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);

      const start = performance.now();
      const result = pipe.transform(largeArray);
      const end = performance.now();

      expect(result).toBe(9999);
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle large object arrays with property keys', () => {
      const largeObjectArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        category: `category${i % 10}`
      }));

      const start = performance.now();
      const result = pipe.transform(largeObjectArray, 'value');
      const end = performance.now();

      expect(result).toBeDefined();
      expect(typeof result?.value).toBe('number');
      expect(end - start).toBeLessThan(50);
    });

    it('should handle complex getter functions efficiently', () => {
      const complexArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        data: { x: Math.random(), y: Math.random(), z: Math.random() }
      }));

      const start = performance.now();
      const result = pipe.transform(complexArray, item => 
        Math.sqrt(item.data.x ** 2 + item.data.y ** 2 + item.data.z ** 2)
      );
      const end = performance.now();

      expect(result).toBeDefined();
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('type safety', () => {
    it('should work with strongly typed interfaces', () => {
      interface User {
        id: number;
        name: string;
        age: number;
        isActive: boolean;
      }

      const users: User[] = [
        { id: 1, name: 'John', age: 25, isActive: true },
        { id: 2, name: 'Jane', age: 30, isActive: false },
        { id: 3, name: 'Bob', age: 28, isActive: true }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toEqual({ id: 2, name: 'Jane', age: 30, isActive: false });
      // TypeScript should infer result as User | null
      expect(result?.name).toBe('Jane');
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

      // TypeScript should maintain Product type
      expect(result?.id).toBeDefined();
      expect(result?.name).toBeDefined();
    });
  });

  describe('real-world scenarios', () => {
    it('should find most expensive product in e-commerce', () => {
      const products = [
        { id: 1, name: 'iPhone', price: 999, category: 'electronics' },
        { id: 2, name: 'Shirt', price: 29, category: 'clothing' },
        { id: 3, name: 'Laptop', price: 1499, category: 'electronics' },
        { id: 4, name: 'Headphones', price: 199, category: 'electronics' }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toEqual({ id: 3, name: 'Laptop', price: 1499, category: 'electronics' });
    });

    it('should find latest event by timestamp', () => {
      const events = [
        { id: 1, name: 'Meeting', timestamp: 1640995200000 }, // 2022-01-01 00:00:00
        { id: 2, name: 'Call', timestamp: 1640995800000 },    // 2022-01-01 00:10:00
        { id: 3, name: 'Lunch', timestamp: 1640991600000 }    // 2021-12-31 23:00:00
      ];

      const result = pipe.transform(events, 'timestamp');

      expect(result).toEqual({ id: 2, name: 'Call', timestamp: 1640995800000 });
    });

    it('should find student with highest grade', () => {
      const students = [
        { name: 'Alice', grades: [85, 90, 88] },
        { name: 'Bob', grades: [78, 82, 80] },
        { name: 'Charlie', grades: [92, 88, 94] }
      ];

      const result = pipe.transform(students, student => 
        student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length
      );

      expect(result?.name).toBe('Charlie');
    });

    it('should find user with highest activity score', () => {
      const users = [
        { id: 1, name: 'John', posts: 25, likes: 150, comments: 45 },
        { id: 2, name: 'Jane', posts: 30, likes: 200, comments: 60 },
        { id: 3, name: 'Bob', posts: 20, likes: 100, comments: 30 }
      ];

      // Calculate activity score: posts * 2 + likes * 0.1 + comments * 1
      const result = pipe.transform(users, user => 
        user.posts * 2 + user.likes * 0.1 + user.comments * 1
      );

      expect(result?.name).toBe('Jane');
    });

    it('should find task with highest priority (high = 3, medium = 2, low = 1)', () => {
      const tasks = [
        { id: 1, title: 'Fix bug', priority: 3 },
        { id: 2, title: 'Update docs', priority: 1 },
        { id: 3, title: 'Code review', priority: 2 },
        { id: 4, title: 'Deploy', priority: 3 }
      ];

      const result = pipe.transform(tasks, 'priority');

      // Should return the first high priority task encountered
      expect(result).toEqual({ id: 1, title: 'Fix bug', priority: 3 });
    });
  });
});
