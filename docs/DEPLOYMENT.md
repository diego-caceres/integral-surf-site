# Deployment Guide

This document outlines the deployment process and configuration for the Integral Surf Site project.

## Deployment Platforms

### Vercel (Primary)

The project is primarily deployed on Vercel, which provides:

- Automatic deployments from Git
- Preview deployments for pull requests
- Edge network for global CDN
- Serverless functions
- Environment variable management

### Deployment Process

1. **Production Deployment**

   ```bash
   # Build the project
   npm run build

   # Deploy to Vercel
   vercel --prod
   ```

2. **Preview Deployment**
   ```bash
   # Deploy preview
   vercel
   ```

## Environment Configuration

### Required Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Other
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Environment Setup in Vercel

1. Go to project settings in Vercel dashboard
2. Navigate to "Environment Variables"
3. Add all required environment variables
4. Configure for different environments (Production, Preview, Development)

## Build Configuration

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig = {
  // Enable static optimization where possible
  output: "standalone",

  // Configure image domains
  images: {
    domains: ["res.cloudinary.com", "your-other-domain.com"],
  },

  // Configure headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};
```

### Build Scripts

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "vercel-build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

## Deployment Checklist

### Pre-deployment

1. **Code Review**

   - All tests passing
   - No linting errors
   - Code review completed
   - Documentation updated

2. **Environment**

   - All environment variables set
   - Database migrations applied
   - Third-party services configured

3. **Build**
   - Build succeeds locally
   - No TypeScript errors
   - Assets optimized
   - Sitemap generated

### Deployment

1. **Vercel Deployment**

   - Push to main branch
   - Monitor build process
   - Verify environment variables
   - Check build logs

2. **Post-deployment**
   - Verify site is accessible
   - Check all routes
   - Test critical functionality
   - Monitor error logs

## Monitoring and Maintenance

### Performance Monitoring

1. **Vercel Analytics**

   - Monitor page views
   - Track performance metrics
   - Analyze user behavior
   - Identify bottlenecks

2. **Error Tracking**
   - Monitor error rates
   - Track API errors
   - Log client-side errors
   - Set up alerts

### Regular Maintenance

1. **Dependencies**

   ```bash
   # Check for outdated packages
   npm outdated

   # Update dependencies
   npm update

   # Update to latest major versions
   npm install @latest
   ```

2. **Database**
   - Regular backups
   - Monitor performance
   - Optimize queries
   - Clean up old data

## Rollback Procedure

### Quick Rollback

1. **Vercel Dashboard**

   - Go to Deployments
   - Select previous deployment
   - Click "Promote to Production"

2. **Manual Rollback**

   ```bash
   # Revert to previous commit
   git revert HEAD

   # Push changes
   git push origin main
   ```

## Security Considerations

### SSL/TLS

- Vercel provides automatic SSL
- Custom domains should use HTTPS
- Configure security headers
- Enable HSTS

### Environment Security

1. **Secrets Management**

   - Use Vercel environment variables
   - Never commit secrets
   - Rotate keys regularly
   - Use different keys per environment

2. **Access Control**
   - Limit deployment access
   - Use team roles
   - Enable 2FA
   - Audit access logs

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check build logs
   - Verify dependencies
   - Check environment variables
   - Review TypeScript errors

2. **Runtime Errors**
   - Check error logs
   - Verify API endpoints
   - Test database connection
   - Review client-side errors

### Debugging

1. **Local Testing**

   ```bash
   # Run production build locally
   npm run build
   npm run start
   ```

2. **Vercel CLI**

   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Debug deployment
   vercel logs
   ```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
