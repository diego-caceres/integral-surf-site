# Development Guide

This document provides comprehensive guidelines for developing the Integral Surf Site project.

## Development Environment Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Git
- VS Code (recommended) or your preferred IDE
- Supabase account
- Cloudinary account

### Initial Setup

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd integral-surf-site
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`
- Hotfix branches: `hotfix/issue-name`

### Git Workflow

1. Create a new branch from `develop`:

   ```bash
   git checkout develop
   git pull
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

3. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request to `develop`

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example:

```
feat: add user authentication
fix: resolve login form validation
docs: update API documentation
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define interfaces for props and data structures
- Avoid using `any` type
- Use strict type checking
- Follow the TypeScript style guide

### React Components

- Use functional components with hooks
- Server Components by default
- Client Components only when necessary
- Props interfaces for all components
- Follow React best practices

### Styling

- Use Tailwind CSS for styling
- Follow the project's design system
- Use CSS Modules for component-specific styles
- Maintain responsive design
- Follow accessibility guidelines

### File Organization

- Keep files small and focused
- Use meaningful file names
- Follow the established directory structure
- Group related functionality

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sitemap` - Generate sitemap

## Testing

### Testing Guidelines

- Write tests for critical functionality
- Use React Testing Library for component tests
- Follow testing best practices
- Maintain good test coverage

### Running Tests

```bash
npm test
```

## Debugging

### Development Tools

- React Developer Tools
- Next.js debugging tools
- Browser DevTools
- VS Code debugging configuration

### Common Issues

1. **Build Errors**

   - Check TypeScript errors
   - Verify environment variables
   - Check dependency versions

2. **Runtime Errors**
   - Check browser console
   - Verify API endpoints
   - Check authentication state

## Performance Considerations

- Monitor bundle sizes
- Optimize images
- Use proper caching strategies
- Implement lazy loading
- Follow performance best practices

## Security Guidelines

- Never commit sensitive data
- Use environment variables for secrets
- Validate user input
- Follow security best practices
- Regular security audits

## Deployment

### Staging Deployment

1. Push to `develop` branch
2. Verify CI/CD pipeline
3. Test on staging environment

### Production Deployment

1. Create release branch from `develop`
2. Run tests and checks
3. Merge to `main`
4. Deploy to production

## Documentation

- Keep documentation up to date
- Document new features
- Update API documentation
- Maintain changelog

## Getting Help

- Check existing documentation
- Review GitHub issues
- Contact team members
- Use development channels

## Regular Maintenance

- Update dependencies regularly
- Monitor error logs
- Review performance metrics
- Update documentation
- Clean up unused code
