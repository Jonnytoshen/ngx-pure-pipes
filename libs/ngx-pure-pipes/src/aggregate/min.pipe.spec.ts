/**
 * Unit tests for MinPipe
 * 
 * Tests cover minimum value finding functionality including:
 * - Basic minimum finding with primitive arrays
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

import { MinPipe } from './min.pipe';

describe('MinPipe', () => {
  let pipe: MinPipe;

  beforeEach(() => {
    pipe = new MinPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(MinPipe);
    });
  });

  describe('primitive arrays', () => {
    it('should find minimum in number array', () => {
      const numbers = [5, 2, 8, 1, 9];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(1);
    });

    it('should handle array with one element', () => {
      const numbers = [42];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(42);
    });

    it('should handle array with negative numbers', () => {
      const numbers = [5, -2, 8, -10, 3];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(-10);
    });

    it('should handle array with decimal numbers', () => {
      const numbers = [3.14, 2.71, 1.41, 2.23];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(1.41);
    });

    it('should handle array with zero', () => {
      const numbers = [5, 0, 3, 2];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(0);
    });

    it('should handle array with duplicate minimum values', () => {
      const numbers = [5, 1, 3, 1, 4];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(1);
    });

    it('should handle array with all same values', () => {
      const numbers = [7, 7, 7, 7];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(7);
    });
  });

  describe('object arrays with property keys', () => {
    it('should find object with minimum numeric property', () => {
      const users = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 22 },
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 27 }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toEqual({ name: 'Jane', age: 22 });
    });

    it('should find product with minimum price', () => {
      const products = [
        { name: 'Laptop', price: 999.99 },
        { name: 'Phone', price: 599.99 },
        { name: 'Tablet', price: 399.99 },
        { name: 'Watch', price: 299.99 }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toEqual({ name: 'Watch', price: 299.99 });
    });

    it('should handle objects with duplicate minimum values', () => {
      const items = [
        { id: 1, score: 85 },
        { id: 2, score: 70 },
        { id: 3, score: 70 },
        { id: 4, score: 90 }
      ];

      const result = pipe.transform(items, 'score');

      expect(result).toEqual({ id: 2, score: 70 });
    });

    it('should handle objects with negative property values', () => {
      const data = [
        { name: 'A', value: 5 },
        { name: 'B', value: -10 },
        { name: 'C', value: 3 },
        { name: 'D', value: -5 }
      ];

      const result = pipe.transform(data, 'value');

      expect(result).toEqual({ name: 'B', value: -10 });
    });

    it('should handle objects with decimal property values', () => {
      const measurements = [
        { name: 'A', temperature: 23.5 },
        { name: 'B', temperature: 18.2 },
        { name: 'C', temperature: 25.1 },
        { name: 'D', temperature: 17.8 }
      ];

      const result = pipe.transform(measurements, 'temperature');

      expect(result).toEqual({ name: 'D', temperature: 17.8 });
    });
  });

  describe('object arrays with getter functions', () => {
    it('should find object with minimum computed value', () => {
      const products = [
        { name: 'Laptop', basePrice: 1000, discount: 0.1 },
        { name: 'Phone', basePrice: 800, discount: 0.2 },
        { name: 'Tablet', basePrice: 600, discount: 0.05 }
      ];

      const result = pipe.transform(products, item => item.basePrice * (1 - item.discount));

      expect(result).toEqual({ name: 'Tablet', basePrice: 600, discount: 0.05 });
    });

    it('should handle complex calculations', () => {
      const students = [
        { name: 'John', homework: 85, exam: 90, attendance: 95 },
        { name: 'Jane', homework: 92, exam: 88, attendance: 98 },
        { name: 'Bob', homework: 78, exam: 85, attendance: 90 }
      ];

      // Calculate weighted average: 40% homework, 50% exam, 10% attendance
      const result = pipe.transform(students, student => 
        student.homework * 0.4 + student.exam * 0.5 + student.attendance * 0.1
      );

      expect(result).toEqual({ name: 'Bob', homework: 78, exam: 85, attendance: 90 });
    });

    it('should handle getter functions returning negative values', () => {
      const data = [
        { name: 'A', x: 5, y: 3 },
        { name: 'B', x: -2, y: 4 },
        { name: 'C', x: 1, y: -8 }
      ];

      const result = pipe.transform(data, item => item.x * item.y);

      expect(result).toEqual({ name: 'B', x: -2, y: 4 });
    });

    it('should handle getter functions with complex object properties', () => {
      const employees = [
        { name: 'John', salary: { base: 50000, bonus: 5000 } },
        { name: 'Jane', salary: { base: 60000, bonus: 3000 } },
        { name: 'Bob', salary: { base: 45000, bonus: 8000 } }
      ];

      const result = pipe.transform(employees, emp => emp.salary.base + emp.salary.bonus);

      const bobTotal = 45000 + 8000;
      const janeTotal = 60000 + 3000;
      const johnTotal = 50000 + 5000;

      expect(bobTotal).toBeLessThan(johnTotal);
      expect(bobTotal).toBeLessThan(janeTotal);
      expect(result).toEqual({ name: 'Bob', salary: { base: 45000, bonus: 8000 } });
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
        { name: 'Jane', age: 22 }
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

      expect(result1).toBe(2);
      expect(result2).toBe(1);
      expect(result3).toBe(2);
      expect(result1).toEqual(result3);
    });
  });

  describe('performance and large datasets', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);

      const start = performance.now();
      const result = pipe.transform(largeArray);
      const end = performance.now();

      expect(result).toBe(0);
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
        { id: 2, name: 'Jane', age: 22, isActive: false },
        { id: 3, name: 'Bob', age: 30, isActive: true }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toEqual({ id: 2, name: 'Jane', age: 22, isActive: false });
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

      const result = pipe.transform(products, product => product.price / product.rating);

      // TypeScript should maintain Product type
      expect(result?.id).toBeDefined();
      expect(result?.name).toBeDefined();
    });
  });

  describe('real-world scenarios', () => {
    it('should find cheapest product in e-commerce', () => {
      const products = [
        { id: 1, name: 'iPhone', price: 999, category: 'electronics' },
        { id: 2, name: 'Shirt', price: 29, category: 'clothing' },
        { id: 3, name: 'Book', price: 15, category: 'books' },
        { id: 4, name: 'Headphones', price: 199, category: 'electronics' }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toEqual({ id: 3, name: 'Book', price: 15, category: 'books' });
    });

    it('should find earliest event by timestamp', () => {
      const events = [
        { id: 1, name: 'Meeting', timestamp: 1640995200000 }, // 2022-01-01 00:00:00
        { id: 2, name: 'Call', timestamp: 1640995800000 },    // 2022-01-01 00:10:00
        { id: 3, name: 'Lunch', timestamp: 1640991600000 }    // 2021-12-31 23:00:00
      ];

      const result = pipe.transform(events, 'timestamp');

      expect(result).toEqual({ id: 3, name: 'Lunch', timestamp: 1640991600000 });
    });

    it('should find student with lowest grade', () => {
      const students = [
        { name: 'Alice', grades: [85, 90, 88] },
        { name: 'Bob', grades: [78, 82, 80] },
        { name: 'Charlie', grades: [92, 88, 94] }
      ];

      const result = pipe.transform(students, student => 
        student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length
      );

      expect(result?.name).toBe('Bob');
    });

    it('should find task with minimum priority (urgent = 1, normal = 2, low = 3)', () => {
      const tasks = [
        { id: 1, title: 'Fix bug', priority: 1 },
        { id: 2, title: 'Update docs', priority: 3 },
        { id: 3, title: 'Code review', priority: 2 },
        { id: 4, title: 'Deploy', priority: 1 }
      ];

      const result = pipe.transform(tasks, 'priority');

      // Should return the first urgent task encountered
      expect(result).toEqual({ id: 1, title: 'Fix bug', priority: 1 });
    });
  });
});
