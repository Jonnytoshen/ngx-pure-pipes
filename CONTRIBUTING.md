# Contributing to ngx-pure-pipes

Thank you for your interest in contributing to ngx-pure-pipes! We welcome contributions from the community and are excited to work with you.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18.x or higher)
- npm, yarn, or pnpm
- Git
- Angular CLI (latest version)
- Basic knowledge of TypeScript and Angular

### Types of Contributions

We welcome the following types of contributions:

- 🐛 **Bug fixes**: Fix existing issues or unexpected behavior
- ✨ **New pipes**: Add new pipe implementations
- 📖 **Documentation**: Improve docs, examples, or inline comments
- 🧪 **Tests**: Add or improve test coverage
- 🎨 **Performance**: Optimize existing pipe implementations
- 🔧 **Tooling**: Improve development workflow or build process

## 🛠️ Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Jonnytoshen/ngx-pure-pipes.git
   cd ngx-pure-pipes
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Build the library**
   ```bash
   nx build ngx-pure-pipes
   ```

4. **Run tests**
   ```bash
   nx test ngx-pure-pipes
   ```

5. **Start development server (for docs)**
   ```bash
   nx serve docs
   ```

## 📁 Project Structure

```
ngx-pure-pipes/
├── libs/
│   └── ngx-pure-pipes/
│       ├── src/
│       │   ├── array/          # Array operation pipes
│       │   ├── boolean/        # Boolean logic pipes
│       │   ├── comparison/     # Comparison operation pipes
│       │   ├── math/           # Mathematical operation pipes
│       │   ├── number/         # Number operation pipes
│       │   ├── object/         # Object manipulation pipes
│       │   ├── string/         # String operation pipes
│       │   ├── utility/        # Utility pipes
│       │   ├── aggregate/      # Aggregate operation pipes
│       │   ├── index.ts            # Public API exports
│       │   └── test-setup.ts
│       ├── ng-package.json
│       ├── package.json
│       └── project.json
├── apps/
│   └── docs/                       # Documentation app
└── tools/                          # Build and development tools
```

## 📝 Development Guidelines

### Angular Best Practices

All code must follow these Angular best practices:

- **Standalone Architecture**: All pipes must be standalone (no NgModule dependencies)
- **Pure Pipes**: All pipes must be pure for optimal performance
- **Type Safety**: Use strict TypeScript typing, avoid `any`
- **Modern Angular**: Use Angular 20+ features and patterns

### Pipe Implementation Guidelines

#### 1. Pipe Structure

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeName',
  pure: true, // Always true for performance
})
export class PipeNamePipe implements PipeTransform {
  transform<T>(value: T, ...args: unknown[]): ReturnType {
    // Implementation here
  }
}
```

#### 2. Naming Conventions

- **Pipe names**: Use camelCase for pipe names (e.g., `isNil`, `groupBy`)
- **File names**: Use kebab-case with `.pipe.ts` suffix (e.g., `is-nil.pipe.ts`)
- **Class names**: Use PascalCase with `Pipe` suffix (e.g., `IsNilPipe`)

#### 3. Type Safety Requirements

```typescript
// ✅ Good - Generic with proper constraints
transform<T>(value: T[], predicate: (item: T) => boolean): T[] {
  return value.filter(predicate);
}

// ❌ Bad - Using any
transform(value: any, predicate: any): any {
  return value.filter(predicate);
}

// ✅ Good - Union types for specific values
transform(value: string, caseType: 'upper' | 'lower'): string {
  return caseType === 'upper' ? value.toUpperCase() : value.toLowerCase();
}
```

#### 4. Error Handling

```typescript
// ✅ Good - Defensive programming
transform<T>(value: T[] | null | undefined): number {
  if (!value || !Array.isArray(value)) {
    return 0;
  }
  return value.length;
}

// ✅ Good - Provide meaningful defaults
transform(value: string | null | undefined, defaultValue = ''): string {
  return value ?? defaultValue;
}
```

## 🎯 Coding Standards

### TypeScript Standards

- Use **strict mode** TypeScript configuration
- Prefer **type inference** when type is obvious
- Use **unknown** instead of `any` when type is uncertain
- Use **const assertions** for immutable data
- Use **utility types** (Pick, Omit, Record, etc.) when appropriate

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Use **trailing commas** in multiline structures
- Use **semicolons** at the end of statements
- Maximum line length: **100 characters**

### Documentation Standards

```typescript
/**
 * Filters an array based on a predicate function.
 * 
 * @example
 * ```typescript
 * // In template
 * items | filter:'active':true
 * 
 * // Result: filters items where item.active === true
 * ```
 * 
 * @param value - The array to filter
 * @param property - The property name to check
 * @param expectedValue - The expected value for the property
 * @returns The filtered array
 */
@Pipe({ name: 'filter', pure: true })
export class FilterPipe implements PipeTransform {
  transform<T>(
    value: T[] | null | undefined,
    property: keyof T,
    expectedValue: unknown
  ): T[] {
    // Implementation
  }
}
```

## 🧪 Testing Guidelines

### Test Structure

Each pipe must have comprehensive tests covering:

1. **Happy path scenarios**
2. **Edge cases** (null, undefined, empty values)
3. **Type validation**
4. **Performance considerations**

### Test Example

```typescript
import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  describe('happy path', () => {
    it('should filter array by property value', () => {
      const input = [
        { name: 'John', active: true },
        { name: 'Jane', active: false },
        { name: 'Bob', active: true }
      ];
      
      const result = pipe.transform(input, 'active', true);
      
      expect(result).toHaveLength(2);
      expect(result.map(item => item.name)).toEqual(['John', 'Bob']);
    });
  });

  describe('edge cases', () => {
    it('should return empty array for null input', () => {
      const result = pipe.transform(null, 'active', true);
      expect(result).toEqual([]);
    });

    it('should return empty array for undefined input', () => {
      const result = pipe.transform(undefined, 'active', true);
      expect(result).toEqual([]);
    });

    it('should return empty array for empty array input', () => {
      const result = pipe.transform([], 'active', true);
      expect(result).toEqual([]);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with generic input', () => {
      interface User {
        id: number;
        name: string;
        active: boolean;
      }

      const users: User[] = [
        { id: 1, name: 'John', active: true },
        { id: 2, name: 'Jane', active: false }
      ];

      const result = pipe.transform(users, 'active', true);
      
      // TypeScript should infer User[] type
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('John');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
nx test ngx-pure-pipes

# Run tests in watch mode
nx test ngx-pure-pipes --watch

# Run tests with coverage
nx test ngx-pure-pipes --coverage

# Run specific test file
nx test ngx-pure-pipes --testNamePattern="FilterPipe"
```

## 📤 Submitting Changes

### Before Submitting

1. **Run the full test suite**
   ```bash
   nx test ngx-pure-pipes
   ```

2. **Run linting**
   ```bash
   nx lint ngx-pure-pipes
   ```

3. **Build the library**
   ```bash
   nx build ngx-pure-pipes
   ```

4. **Update documentation** if needed

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/add-new-pipe
   ```

2. **Make your changes**
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new pipe for array chunking"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/add-new-pipe
   ```

5. **Create a Pull Request**
   - Use a descriptive title
   - Include a detailed description
   - Reference any related issues
   - Add examples of usage

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature or pipe
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `chore:` Maintenance tasks

Examples:
```
feat: add groupBy pipe for array operations
fix: handle null values in isNil pipe
docs: update API documentation for filter pipe
test: add edge case tests for map pipe
```

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (please describe)

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Updated existing tests if needed

## Documentation
- [ ] Updated README if needed
- [ ] Added JSDoc comments
- [ ] Updated API documentation

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] No breaking changes (or clearly documented)
- [ ] Pipe is pure and standalone
- [ ] Proper TypeScript typing implemented
```

## 🚀 Release Process

Releases are managed by the maintainers and follow semantic versioning:

- **Major** (x.0.0): Breaking changes
- **Minor** (0.x.0): New features, backward compatible
- **Patch** (0.0.x): Bug fixes, backward compatible

## 💡 Getting Help

If you need help or have questions:

1. Check existing [issues](https://github.com/Jonnytoshen/ngx-pure-pipes/issues) and [discussions](https://github.com/Jonnytoshen/ngx-pure-pipes/discussions)
2. Create a new issue with detailed information

## 🙏 Recognition

Contributors will be recognized in:
- README contributors section
- CHANGELOG for each release
- GitHub contributors graph

Thank you for contributing to ngx-pure-pipes! 🎉
