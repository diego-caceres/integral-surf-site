# Integral Surf Site

A modern surf school website built with Next.js, TypeScript, and Tailwind CSS. This platform provides information about surf lessons, courses, and surf school services.

## Tech Stack

- **Framework**: Next.js 15.1.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**:
  - Headless UI
  - Heroicons
  - Framer Motion
- **Backend/Database**: Supabase
- **Deployment**: Vercel
- **Development**: Turbopack

## Project Structure

```
integral-surf-site/
├── src/
│   ├── app/          # Next.js app router pages and layouts
│   ├── components/   # Reusable React components
│   ├── lib/          # Utility functions and shared logic
│   ├── styles/       # Global styles and Tailwind config
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── scripts/          # Build and utility scripts
```

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account and project

### Environment Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sitemap` - Generate sitemap

## Documentation

For more detailed information about the project, please refer to:

- [Architecture](./docs/ARCHITECTURE.md) - Project structure and architectural decisions
- [Development Guide](./docs/DEVELOPMENT.md) - Development workflow and guidelines
- [Components](./docs/COMPONENTS.md) - Component documentation
- [API Integration](./docs/API.md) - API and database integration
- [Styling Guide](./docs/STYLING.md) - Styling conventions and design system
- [Deployment](./docs/DEPLOYMENT.md) - Deployment process and configuration
- [Contributing](./docs/CONTRIBUTING.md) - How to contribute to the project

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## License

[Add your license information here]
