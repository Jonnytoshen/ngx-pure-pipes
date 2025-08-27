/**
 * Unit tests for TemplatePipe
 * 
 * Tests cover template string interpolation functionality including:
 * - Basic variable replacement with default syntax
 * - Custom regex pattern support
 * - Null/undefined handling
 * - Edge cases and error scenarios
 * - Type safety validation
 * 
 * @author ngx-pure-pipes
 * @since 1.0.0
 */

import { TemplatePipe } from './template.pipe';

describe('TemplatePipe', () => {
  let pipe: TemplatePipe;

  beforeEach(() => {
    pipe = new TemplatePipe();
  });

  describe('instantiation', () => {
    it('should create an instance', () => {
      expect(pipe).toBeTruthy();
      expect(pipe).toBeInstanceOf(TemplatePipe);
    });
  });

  describe('basic variable replacement', () => {
    it('should replace single variable with default syntax', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello World!');
    });

    it('should replace multiple variables', () => {
      const template = '{{greeting}} {{name}}, you have {{count}} messages';
      const variables = { 
        greeting: 'Hi', 
        name: 'John', 
        count: 5 
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hi John, you have 5 messages');
    });

    it('should replace the same variable multiple times', () => {
      const template = '{{name}} said: "Hello {{name}}, how are you {{name}}?"';
      const variables = { name: 'Alice' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Alice said: "Hello Alice, how are you Alice?"');
    });

    it('should handle variables with different data types', () => {
      const template = 'User: {{name}}, Age: {{age}}, Active: {{active}}, Score: {{score}}';
      const variables = { 
        name: 'John', 
        age: 30, 
        active: true, 
        score: 95.5 
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('User: John, Age: 30, Active: true, Score: 95.5');
    });

    it('should handle empty string variables', () => {
      const template = 'Before{{empty}}After';
      const variables = { empty: '' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('BeforeAfter');
    });

    it('should handle zero and false values', () => {
      const template = 'Count: {{count}}, Flag: {{flag}}';
      const variables = { count: 0, flag: false };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Count: 0, Flag: false');
    });
  });

  describe('missing variables handling', () => {
    it('should keep original placeholder when variable is missing', () => {
      const template = 'Hello {{name}} and {{unknown}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello World and {{unknown}}!');
    });

    it('should keep placeholder when variable is undefined', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: undefined };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello {{name}}!');
    });

    it('should keep placeholder when variable is null', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: null };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle mix of existing and missing variables', () => {
      const template = '{{existing}} {{missing}} {{another}}';
      const variables = { existing: 'found', another: 'also found' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('found {{missing}} also found');
    });
  });

  describe('custom regex patterns', () => {
    it('should work with dollar brace syntax', () => {
      const template = 'Hello ${name}!';
      const variables = { name: 'World' };
      const customRegex = /\$\{(.+?)\}/g;
      
      const result = pipe.transform(template, variables, customRegex);
      
      expect(result).toBe('Hello World!');
    });

    it('should work with percentage syntax', () => {
      const template = 'Hello %name%!';
      const variables = { name: 'World' };
      const customRegex = /%(.+?)%/g;
      
      const result = pipe.transform(template, variables, customRegex);
      
      expect(result).toBe('Hello World!');
    });

    it('should work with angle bracket syntax', () => {
      const template = 'Hello <name>!';
      const variables = { name: 'World' };
      const customRegex = /<(.+?)>/g;
      
      const result = pipe.transform(template, variables, customRegex);
      
      expect(result).toBe('Hello World!');
    });

    it('should work with custom complex patterns', () => {
      const template = 'API: {{api.endpoint}}/users/{{user.id}}';
      const variables = { 
        'api.endpoint': 'https://api.example.com',
        'user.id': '123' 
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('API: https://api.example.com/users/123');
    });

    it('should handle regex with different flags', () => {
      const template = 'Hello ${NAME}! Welcome ${name}!';
      const variables = { name: 'World', NAME: 'WORLD' };
      const caseInsensitiveRegex = /\$\{(.+?)\}/gi;
      
      const result = pipe.transform(template, variables, caseInsensitiveRegex);
      
      expect(result).toBe('Hello WORLD! Welcome World!');
    });
  });

  describe('null and undefined handling', () => {
    it('should return null when template is null', () => {
      const result = pipe.transform(null, { name: 'World' });
      
      expect(result).toBeNull();
    });

    it('should return null when template is undefined', () => {
      const result = pipe.transform(undefined, { name: 'World' });
      
      expect(result).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle empty template string', () => {
      const result = pipe.transform('', { name: 'World' });
      
      expect(result).toBe('');
    });

    it('should handle template with no placeholders', () => {
      const template = 'Hello World!';
      const result = pipe.transform(template, { name: 'John' });
      
      expect(result).toBe('Hello World!');
    });

    it('should handle empty variables object', () => {
      const template = 'Hello {{name}}!';
      const result = pipe.transform(template, {});
      
      expect(result).toBe('Hello {{name}}!');
    });

    it('should handle malformed placeholders', () => {
      const template = 'Hello {{name} and {name}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello {{name} and {name}}!');
    });

    it('should handle whitespace in placeholders', () => {
      const template = 'Hello {{ name }}!';
      const variables = { ' name ': 'World' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Hello World!');
    });

    it('should handle special characters in variable values', () => {
      const template = 'Message: {{content}}';
      const variables = { content: 'Hello & "Welcome" to <our> site!' };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Message: Hello & "Welcome" to <our> site!');
    });
  });

  describe('regex validation', () => {
    it('should use default regex when custom regex is null', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables, null as unknown as RegExp);
      
      expect(result).toBe('Hello World!');
    });

    it('should use default regex when custom regex is undefined', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables, undefined);
      
      expect(result).toBe('Hello World!');
    });

    it('should use default regex when custom regex is not a RegExp object', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'World' };
      
      const result = pipe.transform(template, variables, 'not-a-regex' as unknown as RegExp);
      
      expect(result).toBe('Hello World!');
    });
  });

  describe('performance and complex scenarios', () => {
    it('should handle large templates efficiently', () => {
      const template = Array.from({ length: 100 }, (_, i) => `Item {{item${i}}}`).join(' ');
      const variables = Object.fromEntries(
        Array.from({ length: 100 }, (_, i) => [`item${i}`, `value${i}`])
      );
      
      const result = pipe.transform(template, variables);
      
      expect(result).toContain('Item value0');
      expect(result).toContain('Item value99');
      expect(result.split(' ')).toHaveLength(200); // 100 "Item" + 100 "valueX"
    });

    it('should handle deeply nested object notation', () => {
      const template = 'User: {{user.profile.name}}, Email: {{user.contact.email}}';
      const variables = { 
        'user.profile.name': 'John Doe',
        'user.contact.email': 'john@example.com'
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('User: John Doe, Email: john@example.com');
    });

    it('should be pure and stateless', () => {
      const template = 'Hello {{name}}!';
      const variables1 = { name: 'World' };
      const variables2 = { name: 'Universe' };
      
      const result1 = pipe.transform(template, variables1);
      const result2 = pipe.transform(template, variables2);
      const result3 = pipe.transform(template, variables1);
      
      expect(result1).toBe('Hello World!');
      expect(result2).toBe('Hello Universe!');
      expect(result3).toBe('Hello World!');
    });
  });

  describe('type safety', () => {
    it('should work with strongly typed variables', () => {
      interface UserData {
        name: string;
        age: number;
        active: boolean;
      }
      
      const template = 'User: {{name}}, Age: {{age}}, Active: {{active}}';
      const variables: Record<keyof UserData, unknown> = { 
        name: 'John', 
        age: 30, 
        active: true 
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('User: John, Age: 30, Active: true');
    });

    it('should handle union types correctly', () => {
      const template = 'Value: {{value}}';
      const variables: Record<string, string | number | boolean> = { 
        value: 'test' 
      };
      
      const result = pipe.transform(template, variables);
      
      expect(result).toBe('Value: test');
    });
  });
});
