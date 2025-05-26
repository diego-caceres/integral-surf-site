# Components Documentation

This document provides documentation for the reusable components used in the Integral Surf Site project.

## Component Categories

### UI Components (`src/components/ui/`)

Basic building blocks for the user interface.

#### Button

```tsx
import { Button } from "@/components/ui/button";

// Usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>;

// Props
interface ButtonProps {
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
```

#### Input

```tsx
import { Input } from "@/components/ui/input";

// Usage
<Input
  type="text"
  placeholder="Enter your name"
  value={value}
  onChange={handleChange}
/>;

// Props
interface InputProps {
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
}
```

### Form Components (`src/components/forms/`)

Form-related components for data input and validation.

#### Form

```tsx
import { Form } from "@/components/forms/form";

// Usage
<Form onSubmit={handleSubmit}>{/* Form fields */}</Form>;

// Props
interface FormProps {
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
  className?: string;
}
```

### Layout Components (`src/components/layout/`)

Components for page structure and layout.

#### Header

```tsx
import { Header } from "@/components/layout/header";

// Usage
<Header />;

// Props
interface HeaderProps {
  transparent?: boolean;
  className?: string;
}
```

#### Footer

```tsx
import { Footer } from "@/components/layout/footer";

// Usage
<Footer />;

// Props
interface FooterProps {
  className?: string;
}
```

## Component Guidelines

### 1. Component Structure

Each component should follow this structure:

```tsx
// Component file structure
import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Props interface
}

export const Component: FC<ComponentProps> = ({
  // Destructured props
}) => {
  // Component logic

  return (
    // JSX
  )
}
```

### 2. Styling Guidelines

- Use Tailwind CSS for styling
- Use the `cn` utility for conditional classes
- Follow the design system tokens
- Maintain responsive design
- Ensure accessibility

Example:

```tsx
import { cn } from "@/lib/utils";

const Component = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "base-styles",
        "responsive-styles",
        "conditional-styles",
        className
      )}
      {...props}
    />
  );
};
```

### 3. Props Guidelines

- Use TypeScript interfaces for props
- Make props optional when appropriate
- Provide default values when needed
- Document prop types and usage
- Use meaningful prop names

### 4. Component Composition

- Keep components small and focused
- Use composition over inheritance
- Create reusable patterns
- Maintain single responsibility
- Document component relationships

### 5. State Management

- Use React hooks for local state
- Implement proper loading states
- Handle errors gracefully
- Use context when needed
- Document state dependencies

### 6. Performance

- Implement proper memoization
- Use proper event handlers
- Optimize re-renders
- Lazy load when appropriate
- Monitor bundle size

### 7. Accessibility

- Use semantic HTML
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Maintain proper contrast
- Test with screen readers

## Best Practices

1. **Component Creation**

   - Create components in appropriate directories
   - Follow naming conventions
   - Implement proper TypeScript types
   - Add proper documentation
   - Include usage examples

2. **Component Testing**

   - Write unit tests
   - Test different prop combinations
   - Test accessibility
   - Test responsive behavior
   - Test error states

3. **Component Maintenance**
   - Keep components up to date
   - Remove unused props
   - Update documentation
   - Monitor performance
   - Address technical debt

## Common Patterns

### 1. Loading States

```tsx
const Component = ({ isLoading, data }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <div>{/* Render data */}</div>;
};
```

### 2. Error Handling

```tsx
const Component = ({ error, data }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <div>{/* Render data */}</div>;
};
```

### 3. Responsive Design

```tsx
const Component = () => {
  return (
    <div
      className="
      w-full
      md:w-1/2
      lg:w-1/3
      p-4
      md:p-6
      lg:p-8
    "
    >
      {/* Content */}
    </div>
  );
};
```

## Component Library Updates

When adding new components:

1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Implement component logic
4. Add proper styling
5. Write tests
6. Update documentation
7. Add usage examples
8. Review accessibility
9. Test performance
10. Create pull request

## Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Headless UI Documentation](https://headlessui.dev)
- [Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
