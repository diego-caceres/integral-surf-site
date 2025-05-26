# Styling Guide

This document outlines the styling conventions and design system for the Integral Surf Site project.

## Design System

### Colors

```typescript
// tailwind.config.ts
const colors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Primary brand color
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b", // Secondary brand color
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  // ... other colors
};
```

### Typography

```typescript
// tailwind.config.ts
const typography = {
  fontFamily: {
    sans: ["var(--font-geist-sans)"],
    mono: ["var(--font-geist-mono)"],
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  },
};
```

### Spacing

```typescript
// tailwind.config.ts
const spacing = {
  0: "0px",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};
```

### Breakpoints

```typescript
// tailwind.config.ts
const screens = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
```

## Component Styling

### Button Styles

```tsx
// Example button component with variants
const buttonVariants = {
  primary: "bg-primary-500 hover:bg-primary-600 text-white",
  secondary: "bg-secondary-500 hover:bg-secondary-600 text-white",
  outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
```

### Form Styles

```tsx
// Example form input styles
const inputStyles = {
  base: "w-full rounded-lg border border-gray-300 px-4 py-2",
  focus: "focus:border-primary-500 focus:ring-1 focus:ring-primary-500",
  error: "border-red-500 focus:border-red-500 focus:ring-red-500",
  disabled: "bg-gray-100 cursor-not-allowed",
};
```

### Card Styles

```tsx
// Example card component styles
const cardStyles = {
  base: "rounded-lg bg-white shadow-sm",
  padding: "p-4 md:p-6",
  hover: "hover:shadow-md transition-shadow",
  border: "border border-gray-200",
};
```

## Utility Classes

### Common Layout Utilities

```html
<!-- Container -->
<div class="container mx-auto px-4 md:px-6 lg:px-8">
  <!-- Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    <!-- Flex -->
    <div
      class="flex flex-col md:flex-row items-center justify-between gap-4"
    ></div>
  </div>
</div>
```

### Common Spacing Utilities

```html
<!-- Margin -->
<div class="m-4 md:m-6 lg:m-8">
  <div class="mt-4 mb-6 mx-auto">
    <!-- Padding -->
    <div class="p-4 md:p-6 lg:p-8">
      <div class="pt-4 pb-6 px-4"></div>
    </div>
  </div>
</div>
```

### Common Typography Utilities

```html
<!-- Headings -->
<h1 class="text-4xl font-bold text-gray-900">
  <h2 class="text-2xl font-semibold text-gray-800">
    <h3 class="text-xl font-medium text-gray-700">
      <!-- Body Text -->
      <p class="text-base text-gray-600"></p>
      <p class="text-sm text-gray-500"></p>
    </h3>
  </h2>
</h1>
```

## Responsive Design

### Mobile-First Approach

```html
<!-- Base styles (mobile) -->
<div class="w-full p-4">
  <!-- Responsive styles -->
  <div
    class="
  w-full
  p-4
  md:w-1/2
  md:p-6
  lg:w-1/3
  lg:p-8
"
  ></div>
</div>
```

### Common Breakpoint Patterns

```html
<!-- Hide/Show based on breakpoint -->
<div class="hidden md:block">
  <div class="block md:hidden">
    <!-- Stack to Row -->
    <div class="flex flex-col md:flex-row">
      <!-- Grid columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
    </div>
  </div>
</div>
```

## Animation and Transitions

### Common Transitions

```typescript
// tailwind.config.ts
const transition = {
  DEFAULT: "transition-all duration-200 ease-in-out",
  fast: "transition-all duration-150 ease-in-out",
  slow: "transition-all duration-300 ease-in-out",
};
```

### Animation Classes

```html
<!-- Fade in -->
<div class="animate-fade-in">
  <!-- Slide in -->
  <div class="animate-slide-in">
    <!-- Scale -->
    <div class="transform transition-transform hover:scale-105"></div>
  </div>
</div>
```

## Dark Mode

### Dark Mode Configuration

```typescript
// tailwind.config.ts
const darkMode = {
  dark: "class",
  // or 'media' for system preference
};
```

### Dark Mode Classes

```html
<!-- Dark mode styles -->
<div
  class="
  bg-white
  text-gray-900
  dark:bg-gray-900
  dark:text-white
"
></div>
```

## Best Practices

1. **Component Styling**

   - Use Tailwind CSS utility classes
   - Create reusable component classes
   - Follow consistent naming conventions
   - Use CSS Modules for complex styles

2. **Responsive Design**

   - Follow mobile-first approach
   - Use appropriate breakpoints
   - Test on multiple devices
   - Maintain consistent spacing

3. **Accessibility**

   - Maintain proper contrast ratios
   - Use semantic HTML
   - Support keyboard navigation
   - Test with screen readers

4. **Performance**
   - Minimize custom CSS
   - Use utility classes
   - Optimize images
   - Lazy load when appropriate

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Headless UI Documentation](https://headlessui.dev)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
