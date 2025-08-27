# Nextplate Monorepo Deployment Guide

This guide explains how to deploy the Nextplate monorepo (API and Web apps) to Vercel.

## Project Structure

```
nextplate/
├── apps/
│   ├── api/          # Hono API backend
│   └── web/          # Next.js 15 frontend
├── packages/
│   ├── database/     # Shared database schemas
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml
```

## Important: Vercel Deployment Strategy

Since Vercel doesn't support deploying multiple apps from a single repository in one deployment, you need to create **two separate Vercel projects**:

1. One for the API (`apps/api`)
2. One for the Web app (`apps/web`)

## Prerequisites

- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- PostgreSQL database (e.g., Neon, Supabase, or any PostgreSQL provider)
- Environment variables ready

## Step 1: Deploy the API

### 1.1 Navigate to the API directory

```bash
cd apps/api
```

### 1.2 Deploy to Vercel

```bash
vercel
```

### 1.3 Configure the deployment

When prompted, use these settings:

- **Set up and deploy**: Yes
- **Which scope**: Choose your Vercel account
- **Link to existing project?**: No (create new)
- **Project name**: `nextplate-api` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings?**: No

### 1.4 Set Environment Variables

In the Vercel dashboard for your API project:

1. Go to Settings → Environment Variables
2. Add these variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=production
   ```

### 1.5 Deploy to Production

```bash
vercel --prod
```

Your API will be available at: `https://nextplate-api.vercel.app`

## Step 2: Deploy the Web App

### 2.1 Navigate to the Web directory

```bash
cd ../web
```

### 2.2 Deploy to Vercel

```bash
vercel
```

### 2.3 Configure the deployment

When prompted, use these settings:

- **Set up and deploy**: Yes
- **Which scope**: Choose your Vercel account
- **Link to existing project?**: No (create new)
- **Project name**: `nextplate-web` (or your preferred name)
- **Directory**: `./` (current directory)
- **Override settings?**: No

### 2.4 Set Environment Variables

In the Vercel dashboard for your Web project:

1. Go to Settings → Environment Variables
2. Add these variables:
   ```
   NEXT_PUBLIC_API_URL=https://nextplate-api.vercel.app
   NODE_ENV=production
   # Add any other Next.js environment variables your app needs
   ```

### 2.5 Deploy to Production

```bash
vercel --prod
```

Your web app will be available at: `https://nextplate-web.vercel.app`

## Step 3: Configure API URLs in Web App

### Update API calls in your Next.js app

Create a utility function to get the API URL:

```typescript
// apps/web/lib/api.ts
export function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}
```

Use this function in your API calls:

```typescript
import { getApiUrl } from "@/lib/api";

const response = await fetch(`${getApiUrl()}/api/endpoint`);
```

## Vercel Configuration Files

### API (`apps/api/vercel.json`)

```json
{
  "buildCommand": "cd ../.. && pnpm run build --filter=@nextplate/api",
  "outputDirectory": ".",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": null,
  "functions": {
    "api/index.ts": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

### Web (`apps/web/vercel.json`)

```json
{
  "buildCommand": "cd ../.. && pnpm run build --filter=@nextplate/web",
  "outputDirectory": ".next",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

## Continuous Deployment

### GitHub Integration

1. Connect each Vercel project to your GitHub repository
2. Set the **Root Directory** in Vercel project settings:
   - For API: `apps/api`
   - For Web: `apps/web`
3. Enable automatic deployments on push

### Branch Deployments

- Production branch: `main` or `master`
- Preview deployments: All other branches

## Troubleshooting

### Build Failures

- **Issue**: Workspace dependencies not found

  - **Solution**: Ensure `installCommand` in `vercel.json` runs from monorepo root

- **Issue**: Build command fails
  - **Solution**: Verify turborepo filter names match package.json names

### Runtime Errors

- **Issue**: API calls fail from web app
  - **Solution**: Check `NEXT_PUBLIC_API_URL` environment variable
  - **Solution**: Verify CORS settings in API

### Package Manager Issues

- **Issue**: Vercel uses wrong package manager
  - **Solution**: The `installCommand` explicitly uses pnpm
  - **Solution**: Ensure `pnpm-lock.yaml` is committed

## Local Development

### Run both apps locally:

```bash
# From monorepo root
pnpm dev
```

This will start:

- API on `http://localhost:8000`
- Web on `http://localhost:3000`

### Test production builds locally:

```bash
# Build all apps
pnpm build

# Run API
cd apps/api && pnpm start

# In another terminal, run Web
cd apps/web && pnpm start
```

## Environment Variables Reference

### API Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=production
PORT=3000
```

### Web Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
NODE_ENV=production
# Add authentication variables if using NextAuth
NEXTAUTH_URL=https://your-web-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

## Performance Optimization

### API Optimizations

- Database connection pooling is configured for serverless
- Function timeout set to 10 seconds
- Cold start optimizations in place

### Web Optimizations

- Next.js 15 with App Router
- Automatic static optimization
- Image optimization enabled
- Font optimization enabled

## Monitoring

### Vercel Analytics

- Enable Analytics in both Vercel projects
- Monitor performance metrics
- Track API response times

### Logs

- View function logs in Vercel dashboard
- Use `console.log` for debugging (visible in Vercel logs)

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure appropriate origins in production
3. **Database**: Use connection pooling and SSL
4. **API Keys**: Store securely in Vercel environment variables
5. **Authentication**: Implement proper auth between frontend and backend

## Scaling

### API Scaling

- Vercel automatically scales serverless functions
- Consider database connection limits
- Monitor cold starts

### Web Scaling

- Next.js automatically optimizes for performance
- Use ISR (Incremental Static Regeneration) where appropriate
- Implement caching strategies

## Cost Optimization

1. **Optimize build times**: Use turborepo caching
2. **Reduce function invocations**: Implement caching
3. **Optimize images**: Use Next.js Image component
4. **Monitor usage**: Check Vercel dashboard regularly

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hono Documentation](https://hono.dev/)
