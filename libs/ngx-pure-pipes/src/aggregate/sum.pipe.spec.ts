/**
 * Unit tests for SumPipe
 * 
 * Tests cover summation functionality including:
 * - Basic summation with primitive arrays
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

import { SumPipe } from './sum.pipe';

describe('SumPipe', () => {
  let pipe: SumPipe;

  beforeEach(() => {
    pipe = new SumPipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(SumPipe);
    });
  });

  describe('primitive arrays', () => {
    it('should sum positive numbers', () => {
      const numbers = [1, 2, 3, 4, 5];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(15);
    });

    it('should sum decimal numbers', () => {
      const numbers = [1.5, 2.25, 3.75];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(7.5);
    });

    it('should sum negative numbers', () => {
      const numbers = [-1, -2, -3, -4];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(-10);
    });

    it('should sum mixed positive and negative numbers', () => {
      const numbers = [10, -5, 8, -3, 2];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(12);
    });

    it('should handle array with zeros', () => {
      const numbers = [0, 5, 0, 3, 0];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(8);
    });

    it('should handle array with single element', () => {
      const numbers = [42];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(42);
    });

    it('should return 0 for empty array', () => {
      const numbers: number[] = [];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(0);
    });

    it('should handle very large numbers', () => {
      const numbers = [1000000, 2000000, 3000000];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(6000000);
    });

    it('should handle very small decimal numbers', () => {
      const numbers = [0.001, 0.002, 0.003];
      
      const result = pipe.transform(numbers);
      
      expect(result).toBeCloseTo(0.006);
    });

    it('should handle scientific notation', () => {
      const numbers = [1e3, 2e3, 3e3]; // 1000, 2000, 3000
      
      const result = pipe.transform(numbers);
      
      expect(result).toBe(6000);
    });
  });

  describe('object arrays with property keys', () => {
    it('should sum numeric properties from objects', () => {
      const products = [
        { name: 'Laptop', price: 999.99 },
        { name: 'Phone', price: 599.99 },
        { name: 'Tablet', price: 399.99 }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toBeCloseTo(1999.97);
    });

    it('should sum ages from user objects', () => {
      const users = [
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 },
        { name: 'Bob', age: 35 },
        { name: 'Alice', age: 28 }
      ];

      const result = pipe.transform(users, 'age');

      expect(result).toBe(118);
    });

    it('should sum quantities from inventory', () => {
      const inventory = [
        { item: 'Apples', quantity: 50 },
        { item: 'Bananas', quantity: 30 },
        { item: 'Oranges', quantity: 25 }
      ];

      const result = pipe.transform(inventory, 'quantity');

      expect(result).toBe(105);
    });

    it('should handle negative property values', () => {
      const transactions = [
        { id: 1, amount: 100 },
        { id: 2, amount: -50 },
        { id: 3, amount: 75 },
        { id: 4, amount: -25 }
      ];

      const result = pipe.transform(transactions, 'amount');

      expect(result).toBe(100);
    });

    it('should handle decimal property values', () => {
      const measurements = [
        { name: 'A', value: 12.5 },
        { name: 'B', value: 8.25 },
        { name: 'C', value: 15.75 }
      ];

      const result = pipe.transform(measurements, 'value');

      expect(result).toBeCloseTo(36.5);
    });

    it('should handle zero property values', () => {
      const scores = [
        { player: 'John', score: 100 },
        { player: 'Jane', score: 0 },
        { player: 'Bob', score: 85 }
      ];

      const result = pipe.transform(scores, 'score');

      expect(result).toBe(185);
    });

    it('should return 0 for empty object array', () => {
      const emptyArray: Array<{ value: number }> = [];

      const result = pipe.transform(emptyArray, 'value');

      expect(result).toBe(0);
    });
  });

  describe('object arrays with getter functions', () => {
    it('should sum computed values from getter function', () => {
      const orders = [
        { quantity: 2, unitPrice: 10.00 },
        { quantity: 3, unitPrice: 15.00 },
        { quantity: 1, unitPrice: 25.00 }
      ];

      const result = pipe.transform(orders, order => order.quantity * order.unitPrice);

      expect(result).toBe(90); // (2*10) + (3*15) + (1*25) = 20 + 45 + 25 = 90
    });

    it('should sum total prices including tax', () => {
      const products = [
        { basePrice: 100, tax: 0.08 },
        { basePrice: 200, tax: 0.1 },
        { basePrice: 150, tax: 0.05 }
      ];

      const result = pipe.transform(products, product => product.basePrice * (1 + product.tax));

      const expected = (100 * 1.08) + (200 * 1.1) + (150 * 1.05); // 108 + 220 + 157.5 = 485.5
      expect(result).toBeCloseTo(expected);
    });

    it('should sum areas of rectangles', () => {
      const rectangles = [
        { width: 5, height: 10 },
        { width: 3, height: 7 },
        { width: 8, height: 4 }
      ];

      const result = pipe.transform(rectangles, rect => rect.width * rect.height);

      expect(result).toBe(103); // (5*10) + (3*7) + (8*4) = 50 + 21 + 32 = 103
    });

    it('should sum weighted scores', () => {
      const students = [
        { homework: 85, exam: 90, participation: 95 },
        { homework: 92, exam: 88, participation: 87 },
        { homework: 78, exam: 95, participation: 90 }
      ];

      // Weighted average: 40% homework, 50% exam, 10% participation
      const result = pipe.transform(students, student => 
        student.homework * 0.4 + student.exam * 0.5 + student.participation * 0.1
      );

      const student1 = 85 * 0.4 + 90 * 0.5 + 95 * 0.1; // 34 + 45 + 9.5 = 88.5
      const student2 = 92 * 0.4 + 88 * 0.5 + 87 * 0.1; // 36.8 + 44 + 8.7 = 89.5
      const student3 = 78 * 0.4 + 95 * 0.5 + 90 * 0.1; // 31.2 + 47.5 + 9 = 87.7
      const expected = student1 + student2 + student3;

      expect(result).toBeCloseTo(expected);
    });

    it('should sum distances from origin', () => {
      const points = [
        { x: 3, y: 4 },
        { x: 1, y: 1 },
        { x: 5, y: 12 }
      ];

      const result = pipe.transform(points, point => Math.sqrt(point.x ** 2 + point.y ** 2));

      const expected = Math.sqrt(9 + 16) + Math.sqrt(1 + 1) + Math.sqrt(25 + 144); // 5 + √2 + 13
      expect(result).toBeCloseTo(expected);
    });

    it('should handle complex nested calculations', () => {
      const employees = [
        { name: 'John', salary: { base: 50000, bonus: 5000 }, years: 3 },
        { name: 'Jane', salary: { base: 60000, bonus: 8000 }, years: 5 },
        { name: 'Bob', salary: { base: 45000, bonus: 3000 }, years: 2 }
      ];

      // Calculate total compensation with experience multiplier
      const result = pipe.transform(employees, emp => 
        (emp.salary.base + emp.salary.bonus) * (1 + emp.years * 0.01)
      );

      const john = 55000 * 1.03; // 56650
      const jane = 68000 * 1.05; // 71400
      const bob = 48000 * 1.02; // 48960
      const expected = john + jane + bob;

      expect(result).toBeCloseTo(expected);
    });

    it('should handle getter functions returning negative values', () => {
      const data = [
        { income: 1000, expenses: 800 },
        { income: 1500, expenses: 1200 },
        { income: 800, expenses: 900 }
      ];

      const result = pipe.transform(data, item => item.income - item.expenses);

      expect(result).toBe(400); // 200 + 300 + (-100) = 400
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
      const originalProducts = [
        { name: 'Laptop', price: 999 },
        { name: 'Phone', price: 599 }
      ];
      const products = [...originalProducts];

      pipe.transform(products, 'price');

      expect(products).toEqual(originalProducts);
    });

    it('should be pure and stateless', () => {
      const numbers1 = [1, 2, 3];
      const numbers2 = [4, 5, 6];

      const result1 = pipe.transform(numbers1);
      const result2 = pipe.transform(numbers2);
      const result3 = pipe.transform(numbers1);

      expect(result1).toBe(6);
      expect(result2).toBe(15);
      expect(result3).toBe(6);
      expect(result1).toEqual(result3);
    });
  });

  describe('performance and large datasets', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 100000 }, (_, i) => i + 1);

      const start = performance.now();
      const result = pipe.transform(largeArray);
      const end = performance.now();

      // Sum of 1 to 100000 = 100000 * 100001 / 2 = 5000050000
      expect(result).toBe(5000050000);
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

      // Sum of 1 to 10000 = 10000 * 10001 / 2 = 50005000
      expect(result).toBe(50005000);
      expect(end - start).toBeLessThan(50);
    });

    it('should handle complex getter functions efficiently', () => {
      const complexArray = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        data: { x: i, y: i * 2, z: i * 3 }
      }));

      const start = performance.now();
      const result = pipe.transform(complexArray, item => 
        item.data.x + item.data.y + item.data.z
      );
      const end = performance.now();

      // Each item contributes: i + (i*2) + (i*3) = i*6
      // Sum from 0 to 4999: sum of (i*6) = 6 * sum(i) = 6 * (4999*5000/2) = 6 * 12497500 = 74985000
      expect(result).toBe(74985000);
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('type safety', () => {
    it('should work with strongly typed interfaces', () => {
      interface Product {
        id: number;
        name: string;
        price: number;
        inStock: boolean;
      }

      const products: Product[] = [
        { id: 1, name: 'Laptop', price: 999, inStock: true },
        { id: 2, name: 'Phone', price: 599, inStock: false },
        { id: 3, name: 'Tablet', price: 399, inStock: true }
      ];

      const result = pipe.transform(products, 'price');

      expect(result).toBe(1997);
      // TypeScript should infer result as number | null
      expect(typeof result).toBe('number');
    });

    it('should maintain type information with getter functions', () => {
      interface Order {
        id: number;
        items: Array<{ price: number; quantity: number }>;
        discount: number;
      }

      const orders: Order[] = [
        { id: 1, items: [{ price: 10, quantity: 2 }], discount: 0.1 },
        { id: 2, items: [{ price: 15, quantity: 1 }, { price: 5, quantity: 3 }], discount: 0.05 }
      ];

      const result = pipe.transform(orders, order => {
        const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return subtotal * (1 - order.discount);
      });

      const order1Total = 20 * 0.9; // 18
      const order2Total = 30 * 0.95; // 28.5
      expect(result).toBeCloseTo(order1Total + order2Total);
    });
  });

  describe('real-world scenarios', () => {
    it('should calculate total revenue from sales', () => {
      const sales = [
        { product: 'Laptop', quantity: 5, unitPrice: 999 },
        { product: 'Phone', quantity: 10, unitPrice: 599 },
        { product: 'Tablet', quantity: 3, unitPrice: 399 }
      ];

      const result = pipe.transform(sales, sale => sale.quantity * sale.unitPrice);

      expect(result).toBe(12182); // (5*999) + (10*599) + (3*399) = 4995 + 5990 + 1197 = 12182
    });

    it('should sum monthly expenses', () => {
      const expenses = [
        { category: 'Rent', amount: 1200 },
        { category: 'Food', amount: 400 },
        { category: 'Transportation', amount: 150 },
        { category: 'Utilities', amount: 200 },
        { category: 'Entertainment', amount: 100 }
      ];

      const result = pipe.transform(expenses, 'amount');

      expect(result).toBe(2050);
    });

    it('should calculate total hours worked', () => {
      const timeEntries = [
        { date: '2024-01-01', hours: 8 },
        { date: '2024-01-02', hours: 7.5 },
        { date: '2024-01-03', hours: 8.5 },
        { date: '2024-01-04', hours: 6 },
        { date: '2024-01-05', hours: 8 }
      ];

      const result = pipe.transform(timeEntries, 'hours');

      expect(result).toBe(38);
    });

    it('should sum order totals with shipping', () => {
      const orders = [
        { subtotal: 99.99, shipping: 9.99, tax: 8.80 },
        { subtotal: 49.99, shipping: 5.99, tax: 4.40 },
        { subtotal: 199.99, shipping: 0, tax: 16.00 }
      ];

      const result = pipe.transform(orders, order => order.subtotal + order.shipping + order.tax);

      expect(result).toBeCloseTo(395.15);
    });

    it('should calculate total score from game rounds', () => {
      const gameRounds = [
        { round: 1, score: 150, multiplier: 1 },
        { round: 2, score: 200, multiplier: 1.5 },
        { round: 3, score: 100, multiplier: 2 },
        { round: 4, score: 250, multiplier: 1.2 }
      ];

      const result = pipe.transform(gameRounds, round => round.score * round.multiplier);

      expect(result).toBe(950); // 150 + 300 + 200 + 300 = 950
    });

    it('should sum portfolio values', () => {
      const portfolio = [
        { symbol: 'AAPL', shares: 10, price: 150.00 },
        { symbol: 'GOOGL', shares: 5, price: 2500.00 },
        { symbol: 'MSFT', shares: 8, price: 300.00 },
        { symbol: 'TSLA', shares: 3, price: 800.00 }
      ];

      const result = pipe.transform(portfolio, holding => holding.shares * holding.price);

      expect(result).toBe(18800); // 1500 + 12500 + 2400 + 2400 = 18800
    });

    it('should calculate total calories consumed', () => {
      const meals = [
        { meal: 'Breakfast', calories: 450 },
        { meal: 'Lunch', calories: 650 },
        { meal: 'Dinner', calories: 800 },
        { meal: 'Snacks', calories: 200 }
      ];

      const result = pipe.transform(meals, 'calories');

      expect(result).toBe(2100);
    });
  });
});
