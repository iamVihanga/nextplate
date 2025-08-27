# Deployment Guide for Nextplate API (Monorepo)

This guide explains how to deploy the Nextplate API to Vercel while maintaining the monorepo structure with workspace dependencies.

## Prerequisites

- Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- PostgreSQL database (e.g., Neon, Supabase, or any PostgreSQL provider)

## Project Structure

The API is part of a turborepo monorepo with the following structure:

```
nextplate/
├── apps/
│   └── api/           # API application
├── packages/
│   ├── database/      # Shared database schemas
│   ├── eslint-config/ # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── package.json       # Root package.json
├── pnpm-workspace.yaml
└── vercel.json        # Root Vercel configuration
```

## Configuration Files

### 1. Root vercel.json

The root `vercel.json` configures the monorepo deployment:

```json
{
  "buildCommand": "pnpm run build --filter=@nextplate/api",
  "outputDirectory": "apps/api",
  "installCommand": "pnpm install",
  "framework": null,
  "functions": {
    "apps/api/api/index.ts": {
      "maxDuration": 10
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/apps/api/api"
    }
  ]
}
```

### 2. API Structure

- `apps/api/src/index.ts` - Main Hono application
- `apps/api/api/index.ts` - Vercel serverless function entry point
- `apps/api/package.json` - API dependencies with workspace references

## Deployment Steps

### 1. Set up Environment Variables

Create a `.env` file in `apps/api/` with:

```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
PORT=3000
```

### 2. Deploy from Root Directory

Deploy the monorepo from the root directory:

```bash
# From the root of your monorepo
cd nextplate

# Deploy to Vercel
vercel

# Or for production deployment
vercel --prod
```

### 3. Configure Environment Variables in Vercel

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to `production`

### 4. Important Vercel Settings

When prompted during deployment or in the Vercel dashboard:

- **Framework Preset**: Other
- **Build Command**: `pnpm run build --filter=@nextplate/api`
- **Output Directory**: `apps/api`
- **Install Command**: `pnpm install`
- **Root Directory**: `.` (deploy from monorepo root)

## Monorepo Considerations

### Workspace Dependencies

The API uses workspace dependencies managed by pnpm:

- `@repo/database` - Shared database schemas
- `@repo/eslint-config` - Shared linting configuration
- `@repo/typescript-config` - Shared TypeScript configuration

These are automatically resolved during the build process.

### Build Process

1. Vercel runs `pnpm install` from the root, installing all workspace dependencies
2. Builds the API using turborepo's filtering: `pnpm run build --filter=@nextplate/api`
3. Deploys the serverless function from `apps/api/api/index.ts`

## Database Optimization

The database connection is optimized for serverless:

- Connection pooling with limited connections (`max: 1`)
- Idle timeout configuration
- SSL configuration for production

## Troubleshooting

### Build Failures

- Ensure all workspace dependencies are properly defined in `pnpm-workspace.yaml`
- Check that the root `package.json` has the necessary build scripts
- Verify that `@repo/database` package exports are correct

### Runtime Errors

- Check environment variables are set in Vercel
- Verify database connection string is correct
- Check Vercel function logs for detailed error messages

### Package Manager Issues

- Vercel should automatically detect pnpm from the lockfile
- If issues persist, ensure `pnpm-lock.yaml` is committed
- The `installCommand` in `vercel.json` explicitly uses pnpm

## Local Testing

To test the serverless function locally:

```bash
# Install Vercel CLI globally
npm i -g vercel

# From the monorepo root
vercel dev
```

This will simulate the Vercel environment locally.

## API Endpoints

Once deployed, your API will be available at:

- Production: `https://your-project.vercel.app`
- API Documentation: `https://your-project.vercel.app/reference`

All routes defined in your Hono application will be accessible through the Vercel deployment.

## Monitoring

- Use Vercel's built-in analytics and logs
- Function logs are available in the Vercel dashboard
- Monitor database connections in your PostgreSQL provider's dashboard

## Updates and Redeployment

To update the API:

1. Make changes in your local development environment
2. Commit and push to your repository
3. Vercel will automatically redeploy on push to the connected branch
4. Or manually redeploy using `vercel --prod` from the root directory
