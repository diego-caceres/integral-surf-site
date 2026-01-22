# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Integral Surf Site is a modern surf school website built with Next.js 15, TypeScript, and Tailwind CSS. The platform features a public-facing site with trip information and an admin dashboard for content management.

## Commands

### Development
```bash
npm run dev           # Start development server with Turbopack
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run sitemap       # Generate sitemap
```

### Environment Variables
Required in `.env.local`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

**Cloudinary Configuration:**
- Uses signed uploads for security (API key/secret required)
- Upload signature endpoint: `/api/cloudinary/sign`
- Images organized in folders: `integral-surf/trips/`, `integral-surf/menu-images/`, etc.

## Architecture

### App Router Structure

The project uses Next.js App Router with a clear separation between public and admin areas:

- **Public routes** (`src/app/`): Homepage, trip listings, trip details, about page, fundamentos page
- **Admin routes** (`src/app/admin/`): Protected by cookie-based authentication, managed through `AdminLayout`
- **API routes** (`src/app/api/`): Split between public APIs and admin APIs (`/api/admin/*`)

### Authentication System

Admin authentication is cookie-based:
- Cookie name: `integralsurf-admin-auth`
- Set via `/api/admin/login` endpoint (POST)
- Validated in `src/app/admin/layout.tsx` before rendering admin pages
- Credentials stored in environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
- No JWT or Supabase Auth for admin area - simple username/password check

### Database (Supabase)

Two Supabase client instances:
1. **Server client** (`src/lib/supabaseServer.ts`): Uses service role key, no session persistence, for API routes
2. **Public client**: Uses anon key for public data fetching

Main database tables:
- `trips`: Main trip data with extensive fields (slug, title, destiny, dates, pricing, section content, images)
- `trip_contents`: Related content blocks for trips (one-to-many relationship)
- `about`: About page content
- `fundamentos`: Fundamentos page content with images
- `configurations`: Site-wide configuration key-value pairs
- `menu_images`: Navigation menu images
- `section_header_images`: Section header images

### Data Flow Patterns

**Trip Management:**
- Trips have soft delete capability (`is_deleted` flag)
- Support for cloning trips via `/api/trips/[id]/clone`
- Support for restoring deleted trips via `/api/trips/[id]/restore`
- Trip contents are managed separately but fetched together using `includeContents` query param
- Order field controls display sequence

**Image Management:**
- Uses Cloudinary for image hosting
- next/image configured with multiple remote patterns (Instagram, Cloudinary, Supabase Storage)
- Images referenced by URL in database

### Component Architecture

**Server Components (default):**
- All components are Server Components unless marked with `'use client'`
- Server Components fetch data directly in component body
- Used for: Trip pages, about page, public listings

**Client Components:**
- Admin forms and interactive UI (AdminLoginForm, AdminNavbar)
- Components with interactivity: FundamentosImageSlider, WhatsAppButton
- Fetcher components that update based on state: TripDetailFetcher, TripEditFetcher

**Component Patterns:**
- Fetcher components separate data fetching from presentation (e.g., `TripDetailFetcher` wraps `TripDetail`)
- Section components for homepage (`SectionHeader`, `SectionExperiences`, `SectionCoaching`, etc.)
- Reusable UI components in `src/components/ui/` (Button, LogoLoader)

### Styling

**Tailwind Configuration:**
- Custom color palette defined in `tailwind.config.ts`:
  - primary: `#0E1A1B` (dark green, vintage style)
  - secondary: `#EAD9C9` (soft beige)
  - accent: `#E4572E` (earthy orange)
  - background: `#FFFFFF`
- Custom fonts: Playfair Display (serif), Poppins, Libre Franklin, Bebas Neue
- Font variables defined in `src/styles/fonts.ts`

**Styling Approach:**
- Tailwind utility classes throughout
- Use `cn()` utility from `src/lib/utils.ts` for conditional class merging
- Framer Motion for animations

### TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- Target: ES2017

## Key Patterns and Conventions

### API Routes

**Public APIs** (`/api/...`):
- GET endpoints for fetching data (trips, about, configurations, fundamentos)
- No authentication required

**Admin APIs** (`/api/admin/...`):
- POST/PUT/DELETE for modifying data
- Should validate admin authentication (some routes may need cookie validation added)
- Handle file uploads for images

### Trip Content Structure

Trips use a complex nested structure:
```typescript
Trip {
  id, slug, title, title_2, destiny, date_month, date_days,
  coaching_subtitle, top_subtitle,
  header_image, header_mobile_image, header_video,
  price_promo, price_final, price_promo_message, price_final_message,
  section_1_title, section_1_description, section_1_subdescription, section_1_image,
  section_2_title, section_2_description, section_2_image,
  section_video_title, section_video_description, section_video_url,
  final_img_1, final_img_2,
  order, is_deleted,
  trip_contents?: TripContent[]
}

TripContent {
  id, trip_id, title, subtitle, description,
  subtitle_2, description_2, image_url, order
}
```

### Admin Layout Logic

The `src/app/admin/layout.tsx` checks authentication before rendering:
- If not authenticated: Shows `AdminLoginForm`
- If authenticated: Shows `AdminNavbar` + admin page content
- This layout wraps all `/admin/*` routes

### Commit Message Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

## Important Files

- `src/lib/supabaseServer.ts`: Server-side Supabase client (service role)
- `src/app/admin/layout.tsx`: Admin authentication guard
- `src/types/trip.ts`: Main type definitions for trip data
- `tailwind.config.ts`: Design tokens and custom styling
- `next.config.ts`: Image domain configuration
