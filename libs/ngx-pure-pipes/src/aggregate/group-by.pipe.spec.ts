/**
 * Unit tests for GroupByPipe
 * 
 * Tests cover array grouping functionality including:
 * - Basic grouping by string properties
 * - Grouping by numeric and boolean properties
 * - Null/undefined handling
 * - Edge cases and error scenarios
 * - Type safety validation
 * - Performance with large datasets
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { GroupByPipe } from './group-by.pipe';

describe('GroupByPipe', () => {
  let pipe: GroupByPipe;

  beforeEach(() => {
    pipe = new GroupByPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(GroupByPipe);
    });
  });

  describe('basic grouping functionality', () => {
    it('should group objects by string property', () => {
      const users = [
        { name: 'John', status: 'active' },
        { name: 'Jane', status: 'inactive' },
        { name: 'Bob', status: 'active' },
        { name: 'Alice', status: 'inactive' }
      ];

      const result = pipe.transform(users, 'status');

      expect(result).toEqual({
        active: [
          { name: 'John', status: 'active' },
          { name: 'Bob', status: 'active' }
        ],
        inactive: [
          { name: 'Jane', status: 'inactive' },
          { name: 'Alice', status: 'inactive' }
        ]
      });
    });

    it('should group objects by numeric property', () => {
      const students = [
        { name: 'John', grade: 85 },
        { name: 'Jane', grade: 90 },
        { name: 'Bob', grade: 85 },
        { name: 'Alice', grade: 95 }
      ];

      const result = pipe.transform(students, 'grade');

      expect(result).toEqual({
        85: [
          { name: 'John', grade: 85 },
          { name: 'Bob', grade: 85 }
        ],
        90: [{ name: 'Jane', grade: 90 }],
        95: [{ name: 'Alice', grade: 95 }]
      });
    });

    it('should group objects by boolean property', () => {
      const items = [
        { name: 'Item1', isActive: true },
        { name: 'Item2', isActive: false },
        { name: 'Item3', isActive: true },
        { name: 'Item4', isActive: false }
      ];

      const result = pipe.transform(items, 'isActive');

      expect(result).toEqual({
        true: [
          { name: 'Item1', isActive: true },
          { name: 'Item3', isActive: true }
        ],
        false: [
          { name: 'Item2', isActive: false },
          { name: 'Item4', isActive: false }
        ]
      });
    });

    it('should handle single item arrays', () => {
      const items = [{ category: 'electronics', name: 'laptop' }];

      const result = pipe.transform(items, 'category');

      expect(result).toEqual({
        electronics: [{ category: 'electronics', name: 'laptop' }]
      });
    });

    it('should handle arrays with all unique values', () => {
      const items = [
        { id: 1, type: 'A' },
        { id: 2, type: 'B' },
        { id: 3, type: 'C' }
      ];

      const result = pipe.transform(items, 'type');

      expect(result).toEqual({
        A: [{ id: 1, type: 'A' }],
        B: [{ id: 2, type: 'B' }],
        C: [{ id: 3, type: 'C' }]
      });
    });

    it('should handle arrays with all same values', () => {
      const items = [
        { name: 'Item1', category: 'same' },
        { name: 'Item2', category: 'same' },
        { name: 'Item3', category: 'same' }
      ];

      const result = pipe.transform(items, 'category');

      expect(result).toEqual({
        same: [
          { name: 'Item1', category: 'same' },
          { name: 'Item2', category: 'same' },
          { name: 'Item3', category: 'same' }
        ]
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty arrays', () => {
      const result = pipe.transform([], 'category');

      expect(result).toEqual({});
    });

    it('should handle arrays with undefined property values', () => {
      const items = [
        { name: 'Item1', category: 'A' },
        { name: 'Item2', category: undefined },
        { name: 'Item3', category: 'A' },
        { name: 'Item4', category: undefined }
      ];

      const result = pipe.transform(items, 'category');

      expect(result).toEqual({
        A: [
          { name: 'Item1', category: 'A' },
          { name: 'Item3', category: 'A' }
        ],
        undefined: [
          { name: 'Item2', category: undefined },
          { name: 'Item4', category: undefined }
        ]
      });
    });

    it('should handle arrays with null property values', () => {
      const items = [
        { name: 'Item1', category: 'A' },
        { name: 'Item2', category: null },
        { name: 'Item3', category: 'B' },
        { name: 'Item4', category: null }
      ];

      const result = pipe.transform(items, 'category');

      expect(result).toEqual({
        A: [{ name: 'Item1', category: 'A' }],
        B: [{ name: 'Item3', category: 'B' }],
        null: [
          { name: 'Item2', category: null },
          { name: 'Item4', category: null }
        ]
      });
    });

    it('should handle arrays with mixed property types', () => {
      const items = [
        { name: 'Item1', value: 'string' },
        { name: 'Item2', value: 42 },
        { name: 'Item3', value: true },
        { name: 'Item4', value: 'string' }
      ];

      const result = pipe.transform(items, 'value');

      expect(result).toEqual({
        string: [
          { name: 'Item1', value: 'string' },
          { name: 'Item4', value: 'string' }
        ],
        42: [{ name: 'Item2', value: 42 }],
        true: [{ name: 'Item3', value: true }]
      });
    });
  });

  describe('null and undefined handling', () => {
    it('should return null when input array is null', () => {
      const result = pipe.transform(null, 'category');

      expect(result).toBeNull();
    });

    it('should return null when input array is undefined', () => {
      const result = pipe.transform(undefined, 'category');

      expect(result).toBeNull();
    });

    it('should return null when input is not an array', () => {
      const result = pipe.transform('not-an-array' as unknown as never[], 'category');

      expect(result).toBeNull();
    });

    it('should return null when input is a number', () => {
      const result = pipe.transform(123 as unknown as never[], 'category');

      expect(result).toBeNull();
    });

    it('should return null when input is an object', () => {
      const result = pipe.transform({ key: 'value' } as unknown as never[], 'category');

      expect(result).toBeNull();
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const originalItems = [
        { name: 'Item1', category: 'A' },
        { name: 'Item2', category: 'B' }
      ];
      const items = [...originalItems]; // Create a copy to verify immutability

      pipe.transform(items, 'category');

      expect(items).toEqual(originalItems);
      expect(items).not.toBe(originalItems); // Ensure we're testing with a copy
    });

    it('should create new arrays for each group', () => {
      const items = [
        { name: 'Item1', category: 'A' },
        { name: 'Item2', category: 'A' }
      ];

      const result = pipe.transform(items, 'category');
      const groupA = result['A'];

      // Modify the grouped array
      groupA?.push({ name: 'Item3', category: 'A' });

      // Original items should be unchanged
      expect(items).toHaveLength(2);
      expect(groupA).toHaveLength(3);
    });

    it('should be pure and stateless', () => {
      const items1 = [{ name: 'Item1', category: 'A' }];
      const items2 = [{ name: 'Item2', category: 'B' }];

      const result1 = pipe.transform(items1, 'category');
      const result2 = pipe.transform(items2, 'category');
      const result3 = pipe.transform(items1, 'category');

      expect(result1).toEqual({ A: [{ name: 'Item1', category: 'A' }] });
      expect(result2).toEqual({ B: [{ name: 'Item2', category: 'B' }] });
      expect(result3).toEqual({ A: [{ name: 'Item1', category: 'A' }] });
      expect(result1).toEqual(result3);
    });
  });

  describe('performance and large datasets', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        category: `category${i % 10}`,
        value: i
      }));

      const start = performance.now();
      const result = pipe.transform(largeArray, 'category');
      const end = performance.now();

      expect(Object.keys(result || {})).toHaveLength(10);
      expect(result['category0']).toHaveLength(100); // 0, 10, 20, ..., 990
      expect(result['category9']).toHaveLength(100); // 9, 19, 29, ..., 999
      expect(end - start).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle arrays with many unique groups', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        uniqueKey: `unique_${i}`
      }));

      const result = pipe.transform(items, 'uniqueKey');

      expect(Object.keys(result || {})).toHaveLength(100);
      Object.values(result || {}).forEach(group => {
        expect(group).toHaveLength(1);
      });
    });
  });

  describe('type safety', () => {
    it('should work with strongly typed interfaces', () => {
      interface User {
        id: number;
        name: string;
        department: string;
        isActive: boolean;
      }

      const users: User[] = [
        { id: 1, name: 'John', department: 'IT', isActive: true },
        { id: 2, name: 'Jane', department: 'HR', isActive: false },
        { id: 3, name: 'Bob', department: 'IT', isActive: true }
      ];

      const result = pipe.transform(users, 'department');

      expect(result).toEqual({
        IT: [
          { id: 1, name: 'John', department: 'IT', isActive: true },
          { id: 3, name: 'Bob', department: 'IT', isActive: true }
        ],
        HR: [{ id: 2, name: 'Jane', department: 'HR', isActive: false }]
      });
    });

    it('should maintain type information in grouped results', () => {
      interface Product {
        id: number;
        name: string;
        category: 'electronics' | 'clothing' | 'books';
        price: number;
      }

      const products: Product[] = [
        { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
        { id: 2, name: 'Shirt', category: 'clothing', price: 29 },
        { id: 3, name: 'Book', category: 'books', price: 15 }
      ];

      const result = pipe.transform(products, 'category');

      // TypeScript should maintain type information
      expect(result['electronics']?.[0].price).toBe(999);
      expect(result['clothing']?.[0].name).toBe('Shirt');
      expect(result['books']?.[0].id).toBe(3);
    });
  });

  describe('real-world scenarios', () => {
    it('should group e-commerce products by category', () => {
      const products = [
        { id: 1, name: 'iPhone', category: 'electronics', price: 999 },
        { id: 2, name: 'Jeans', category: 'clothing', price: 79 },
        { id: 3, name: 'MacBook', category: 'electronics', price: 1299 },
        { id: 4, name: 'T-Shirt', category: 'clothing', price: 25 },
        { id: 5, name: 'Novel', category: 'books', price: 12 }
      ];

      const result = pipe.transform(products, 'category');

      expect(result['electronics']).toHaveLength(2);
      expect(result['clothing']).toHaveLength(2);
      expect(result['books']).toHaveLength(1);
    });

    it('should group user activities by date', () => {
      const activities = [
        { id: 1, action: 'login', date: '2023-01-01', userId: 1 },
        { id: 2, action: 'view', date: '2023-01-01', userId: 2 },
        { id: 3, action: 'logout', date: '2023-01-02', userId: 1 },
        { id: 4, action: 'purchase', date: '2023-01-01', userId: 3 }
      ];

      const result = pipe.transform(activities, 'date');

      expect(result?.['2023-01-01']).toHaveLength(3);
      expect(result?.['2023-01-02']).toHaveLength(1);
    });

    it('should group tasks by priority level', () => {
      const tasks = [
        { id: 1, title: 'Fix bug', priority: 'high' },
        { id: 2, title: 'Update docs', priority: 'low' },
        { id: 3, title: 'Code review', priority: 'medium' },
        { id: 4, title: 'Deploy app', priority: 'high' },
        { id: 5, title: 'Write tests', priority: 'medium' }
      ];

      const result = pipe.transform(tasks, 'priority');

      expect(result['high']).toHaveLength(2);
      expect(result['medium']).toHaveLength(2);
      expect(result['low']).toHaveLength(1);
    });
  });
});
