# Vercel Deployment Guide

## Prerequisites

1. **Database Setup**: Set up a managed PostgreSQL database (e.g., Vercel Postgres, Supabase, or Neon)
2. **Vercel Account**: Create a Vercel account and install Vercel CLI

## Environment Variables

Configure these environment variables in your Vercel dashboard:

```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=https://your-api-domain.vercel.app
CLIENT_APP_URL=https://your-frontend-domain.vercel.app
NODE_ENV=production
LOG_LEVEL=info
```

## Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Vercel

2. **Configure Build Settings**:

   - Framework Preset: Other
   - Root Directory: `apps/api`
   - Build Command: `npm run vercel-build`
   - Output Directory: (leave empty)

3. **Deploy**: Push to your main branch or deploy manually

## Database Migration

Run database migrations after deployment:

```bash
# Using Vercel CLI
vercel env pull .env.local
npm run drizzle:migrate
```

## Testing

Test your deployed API:

```bash
curl https://your-api-domain.vercel.app/api
```

## Notes

- The API will be available at `https://your-domain.vercel.app/api`
- All existing routes are preserved with the `/api` prefix
- Database connections are optimized for serverless with connection limits
- CORS is configured to allow your frontend domain
