# ngx-pure-pipes

A comprehensive collection of pure, standalone Angular pipes that bring operator-style functionality to your templates. Transform your template expressions into readable, testable, and reusable code while maintaining optimal performance and type safety.

[![npm version](https://badge.fury.io/js/ngx-pure-pipes.svg)](https://badge.fury.io/js/ngx-pure-pipes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-20%2B-red.svg)](https://angular.io)

## ✨ Features

- **Pure Pipes**: Zero side effects with optimal change detection performance
- **Tree-shakeable**: Import only what you need for minimal bundle size
- **Standalone**: Modern Angular architecture with no NgModule dependencies
- **Type-safe**: Full TypeScript support with strict typing
- **Operator-style**: Intuitive naming that mirrors functional programming concepts
- **Template-friendly**: Perfect companion for Angular's native control flow (`@if`, `@for`, `@switch`)

## 📦 Installation

```bash
npm install ngx-pure-pipes
# or
yarn add ngx-pure-pipes
# or
pnpm add ngx-pure-pipes
```

## 🚀 Quick Start

```typescript
import { Component } from '@angular/core';
import { EqPipe, AndPipe, IsNilPipe, MapPipe } from 'ngx-pure-pipes';

@Component({
  selector: 'app-example',
  imports: [EqPipe, AndPipe, IsNilPipe, MapPipe],
  template: `
    <!-- Boolean logic -->
    @if ([user.isActive, user.isVerified] | and) {
      <span class="badge success">Verified User</span>
    }
    
    <!-- Comparisons -->
    <div [class.highlight]="status | eq:'premium'">
      Premium Feature
    </div>
    
    <!-- Null checking -->
    @if (user.avatar | isNil) {
      <img src="/default-avatar.png" alt="Default Avatar">
    }
    
    <!-- Array transformations -->
    @for (item of items | map:'name'; track item) {
      <li>{{ item }}</li>
    }
  `
})
export class ExampleComponent {
  user = { isActive: true, isVerified: true, avatar: null };
  status = 'premium';
  items = [{ name: 'Apple' }, { name: 'Banana' }];
}
```

## 📚 Pipe Categories

## 🎯 Usage Patterns

### With Angular Control Flow

```typescript
@Component({
  template: `
    <!-- Conditional rendering -->
    @if (user.age | gte:18) {
      <adult-content></adult-content>
    }
    
    <!-- List rendering with transformations -->
    @for (item of items | filter:'active':true | sortBy:'name'; track item.id) {
      <item-card [data]="item"></item-card>
    }
    
    <!-- Switch statements -->
    @switch (user.role | lowerCase) {
      @case ('admin') { <admin-panel></admin-panel> }
      @case ('user') { <user-dashboard></user-dashboard> }
      @default { <guest-view></guest-view> }
    }
  `
})
```

### With Reactive Forms

```typescript
@Component({
  template: `
    <form [formGroup]="form">
      <input 
        formControlName="email"
        [class.invalid]="form.get('email')?.errors | isTruthy"
      >
      
      @if (form.get('email')?.value | match:'@company.com') {
        <span class="corporate-badge">Corporate Account</span>
      }
    </form>
  `
})
```

### Chaining Pipes

```typescript
@Component({
  template: `
    <!-- Complex data transformations -->
    @for (
      item of users 
        | filter:'active':true 
        | sortBy:'lastLogin' 
        | take:10 
        | map:'displayName';
      track item
    ) {
      <user-item>{{ item }}</user-item>
    }
  `
})
```

## 🔧 Development

This project uses Nx for monorepo management.

```bash
# Build the library
nx build ngx-pure-pipes

# Run tests
nx test ngx-pure-pipes

# Run tests in watch mode
nx test ngx-pure-pipes --watch

# Lint the code
nx lint ngx-pure-pipes

# Generate documentation
nx build docs
```

## 📖 API Documentation

For detailed API documentation with examples, visit our [documentation site](link-to-docs).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines

- All pipes must be pure and standalone
- Maintain strict TypeScript typing
- Include comprehensive unit tests
- Follow Angular coding standards
- Update documentation for new features

## 📋 Requirements

- Angular 20.1.0 or higher
- TypeScript 5.0 or higher
- RxJS 7.0 or higher (for async operations)

## 🗺️ Roadmap

- **v0.1**: Core boolean and comparison pipes
- **v0.2**: Array and string manipulation pipes  
- **v0.3**: Mathematical and aggregate operations
- **v0.4**: Object manipulation utilities
- **v1.0**: Stable API with full documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by functional programming libraries like Lodash and Ramda
- Built with Angular's modern standalone architecture
- Designed for optimal performance with Angular's change detection

---

**Made with ❤️ for the Angular community**
