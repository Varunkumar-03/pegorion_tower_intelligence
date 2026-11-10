# Pegorion Deployment Runbook

## Overview

This document provides step-by-step instructions for deploying Pegorion to production using free-tier hosting services.

## Architecture

```
Internet → CDN/Frontend (Vercel) → Backend API (Render/Railway) → Database (Supabase)
                                ↘ Documents (Supabase Storage)
                                ↘ Redis (Upstash/Redis Labs)
```

## Deployment Steps

### 1. Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Import the Git repository
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` = https://your-backend-url.vercel.app/api/v1
4. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Deploy

### 2. Backend Deployment (Render)

1. Create a Render account at https://render.com
2. Create a new Web Service
3. Configure:
   - Environment: Python 3.11
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Python Version: 3.11+
4. Set environment variables:
   - `DATABASE_URL` - Your Supabase connection string
   - `SECRET_KEY` - Generate a secure random key
   - `CORS_ORIGINS` - Your Vercel frontend URL
   - `DOCUMENT_STORAGE_PATH` - /tmp/documents (or persistent storage)
5. Add PostgreSQL and Redis add-ons or connect external services

### 3. Database Setup (Supabase)

1. Create a Supabase project at https://supabase.com
2. Enable pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Get the connection string from Settings → Database
4. Configure to allow connections from Render

### 4. Storage Setup (Supabase Storage)

1. Create a bucket named `documents`
2. Configure public access for the bucket
3. Get API keys and configure in backend environment variables

## Required Environment Variables

### Backend
```env
DATABASE_URL=postgresql+psycopg2://postgres:password@db.supabase.co:5432/pegorion
SECRET_KEY=your-secure-random-key-here-use-openssl-rand-hex-32
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
DOCUMENT_STORAGE_PATH=/tmp/documents
MAX_FILE_SIZE_MB=50
CORS_ORIGINS=https://your-frontend.vercel.app
REDIS_URL=redis://default:password@redis-xxxxx.upstash.io:6379
OPENAI_API_KEY= # Optional for AI features
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
```

## Database Migrations

### Initial Migration
```bash
# On your local machine or deployment container
alembic upgrade head
```

### Subsequent Migrations
```bash
# Create a new migration
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head
```

## Health Checks

The platform provides several health check endpoints:

1. **API Health**: `GET /health`
   - Returns `{"status": "healthy"}`

2. **Database Connectivity**: Available through health check
   - If database fails, API returns 500 error

3. **Storage Check**: 
   - Document uploads validate file system write access

## Deployment Verification Checklist

- [ ] Frontend loads on Vercel URL
- [ ] Backend responds on Render URL
- [ ] Database connection successful
- [ ] Authentication endpoints working
- [ ] CORS configured correctly
- [ ] Document storage configured
- [ ] Redis connection (if rate limiting enabled)

## Scaling Considerations

### Free Tier Limits
- **Vercel**: 100 GB bandwidth, 1000 serverless invocations/day
- **Render**: 512 MB RAM, 1 GB disk, sleeps after 15 min idle
- **Supabase**: 500 MB database, 1 GB storage, 50k API requests/day

### Optimization for Free Tier
- Implement caching with Redis/Upstash
- Optimize database queries with proper indexing
- Implement request rate limiting
- Use CDN for static assets

## Rollback Procedure

1. Identify the problematic deployment
2. Revert to previous working version using Git tags
3. Rollback database migrations if needed:
   ```bash
   alembic downgrade -1
   ```

## Monitoring

- **Vercel Analytics**: Built-in frontend monitoring
- **Render Metrics**: Backend performance metrics
- **Supabase Logs**: Database query logs
- **Health Endpoint**: Regular health checks

## Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` includes all frontend URLs
- Check Vercel preview URLs during preview deployments

### Database Connection Issues
- Verify Supabase connection string
- Check IP allowlist in Supabase settings
- Ensure pgvector extension is enabled

### File Upload Failures
- Verify storage path permissions
- Check file size limits
- Validate allowed file extensions

### Authentication Issues
- Verify `SECRET_KEY` is set and consistent
- Check token expiration settings
- Clear browser storage for fresh login