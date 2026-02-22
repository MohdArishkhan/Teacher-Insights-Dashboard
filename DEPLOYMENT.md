# Deployment Guide

This guide covers deploying the Teacher Insights Dashboard to production.

## Prerequisites

- GitHub account and repository
- MongoDB Atlas account
- Vercel account (free tier available)

## Step 1: Prepare MongoDB Atlas

1. **Create a MongoDB Atlas Cluster**:
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Create a new project
   - Create a new cluster (free tier available)

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Drivers" → "Node.js"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

3. **Whitelist IP Addresses**:
   - Go to "Network Access"
   - Add your current IP
   - Or allow access from anywhere (0.0.0.0/0) for development

## Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Teacher Insights Dashboard"
git branch -M main
git remote add origin https://github.com/yourusername/teacher-insights-dashboard.git
git push -u origin main
```

2. **Verify Files Are Committed**:
```bash
git status  # Should show no uncommitted changes
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. **Visit Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Repository**:
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - Under "Environment Variables", add:
     - Key: `MONGODB_URI`
     - Value: Your MongoDB connection string
   - Click "Add"

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Visit your live dashboard at `your-project.vercel.app`

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm i -g vercel
# or
pnpm add -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Follow Prompts**:
   - Connect to GitHub when prompted
   - Set project name
   - Set MongoDB URI environment variable
   - Deploy

## Step 4: Post-Deployment Verification

1. **Check Dashboard**:
   - Visit your deployed URL
   - Verify data loads correctly
   - Test teacher filtering

2. **Monitor Logs**:
   - Visit Vercel dashboard
   - Check deployment logs for errors
   - Monitor function execution

3. **Test Performance**:
   - Use browser DevTools to check load times
   - Verify responsive design on mobile

## Environment Variables

Required environment variables for production:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teacher_insights?retryWrites=true&w=majority
```

### Get MongoDB Connection String

1. MongoDB Atlas → Cluster → Connect
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Replace placeholders:
   - `<username>`: Your MongoDB user
   - `<password>`: Your MongoDB password
   - Database is already set to `teacher_insights`

## Troubleshooting Deployment

### Build Fails with "MongoDB Connection Error"

**Solution**: 
- Verify `MONGODB_URI` is set in Vercel environment variables
- Check MongoDB connection string format
- Ensure IP whitelist includes Vercel IPs (or allow 0.0.0.0/0)

### Dashboard Shows "No Data Available"

**Solution**:
- Check that database seeding completed
- Verify MongoDB cluster is running
- Check Vercel function logs: Vercel Dashboard → Function Logs

### Slow Performance

**Solution**:
- Check MongoDB query performance
- Enable caching in Vercel Edge Config
- Consider upgrading MongoDB cluster
- Add database indexes (already included)

### 502 Bad Gateway Errors

**Solution**:
- Check function logs for errors
- Verify MongoDB connection timeout settings
- Increase Vercel function timeout (if available on plan)
- Check MongoDB Atlas Status page

## Custom Domain

1. **Add Domain to Vercel**:
   - Vercel Dashboard → Project → Settings → Domains
   - Enter your domain
   - Update DNS records as shown

2. **DNS Configuration**:
   - Point your domain to Vercel nameservers
   - Or add CNAME record to `cname.vercel.com`

## Continuous Deployment

Vercel automatically deploys on:
- Push to main branch
- Pull request created (preview deployment)
- Redeployment triggered from dashboard

## Rollback

If deployment has issues:

1. **Vercel Dashboard**:
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Redeploy"

2. **Manual Rollback**:
```bash
git revert <commit-hash>
git push origin main
```

## Scaling Considerations

### As User Load Increases

1. **Database**:
   - Upgrade MongoDB cluster to M10+
   - Enable sharding for large datasets
   - Implement read replicas

2. **API Performance**:
   - Add caching headers
   - Implement request deduplication
   - Use Vercel Postgres for analytical queries

3. **Frontend**:
   - Implement pagination
   - Add search indexing
   - Consider static generation

## Security Best Practices

1. **Environment Variables**:
   - Never commit `.env.local`
   - Use Vercel's secure environment variable management
   - Rotate credentials periodically

2. **MongoDB**:
   - Use strong passwords
   - Enable IP whitelist
   - Use read-only credentials where possible
   - Enable audit logging

3. **API Security**:
   - Add rate limiting (future improvement)
   - Implement authentication (future improvement)
   - Validate all inputs

## Monitoring

### Set Up Vercel Analytics

1. **Enable Analytics**:
   - Vercel Dashboard → Project → Analytics
   - Monitor performance metrics

2. **Custom Monitoring**:
   - Set up error tracking with Sentry
   - Monitor database performance
   - Set up alerts for errors

## Support

For issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check MongoDB documentation: https://docs.mongodb.com
3. Review deployment logs
4. Open GitHub issue in repository

## Quick Reference

### Common Commands

```bash
# Local development
pnpm dev

# Production build
pnpm build
pnpm start

# View logs
vercel logs

# Deploy
vercel --prod

# Environment check
vercel env list
```

### Useful Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
