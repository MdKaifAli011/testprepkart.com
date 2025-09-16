# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Your database is already configured
3. **GitHub Repository**: Your code should be in a GitHub repo

## Step 1: Prepare Your Repository

Your project is already configured for Vercel deployment with:

- ✅ `vercel.json` - Vercel configuration
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Next.js configuration with Payload CMS
- ✅ All API routes properly configured

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `backend` folder as the root directory
5. Configure environment variables (see Step 3)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from the backend directory
cd backend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? testprepkart-backend
# - In which directory is your code located? ./
```

## Step 3: Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables:

```
DATABASE_URI=mongodb+srv://hellomdkaifali_db_user:hellomdkaifali_db_use@cluster0.vywipih.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PAYLOAD_SECRET=your-super-secret-key-change-this-in-production-12345
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### How to Add Environment Variables:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Make sure to select "Production" environment

## Step 4: MongoDB Atlas Configuration

Your MongoDB Atlas is already configured, but ensure:

1. **IP Whitelist**: Add `0.0.0.0/0` to allow all IPs (or Vercel's IP ranges)
2. **Database User**: Your user `hellomdkaifali_db_user` has proper permissions
3. **Connection String**: The URI is correct and accessible

## Step 5: Test Your Deployment

After deployment, test these endpoints:

### Admin Panel:

```
https://your-app-name.vercel.app/admin
```

### API Endpoints:

```
https://your-app-name.vercel.app/api/exam-category
https://your-app-name.vercel.app/api/exam
https://your-app-name.vercel.app/api/leads
https://your-app-name.vercel.app/api/posts
https://your-app-name.vercel.app/api/download-menus
https://your-app-name.vercel.app/api/sub-folders
https://your-app-name.vercel.app/api/media
https://your-app-name.vercel.app/api/stats
https://your-app-name.vercel.app/api/exam-info
https://your-app-name.vercel.app/api/exam-sub-info
https://your-app-name.vercel.app/api/users
```

## Step 6: Database Setup

Your database is already configured and contains your data. No additional seeding is required.

## Important Notes

### Security:

- ✅ Change `PAYLOAD_SECRET` to a strong, unique value
- ✅ Use environment variables for all sensitive data
- ✅ Consider using Payload Cloud for additional security

### Performance:

- ✅ Vercel automatically handles scaling
- ✅ API routes have 30-second timeout (configurable)
- ✅ Static files are served from CDN

### Limitations:

- ⚠️ Serverless functions have execution time limits
- ⚠️ File uploads are limited (check Vercel limits)
- ⚠️ Database connections are per-request (not persistent)

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Check for TypeScript errors

2. **Database Connection Issues**:
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user permissions

3. **API Timeouts**:
   - Increase timeout in `vercel.json`
   - Optimize database queries
   - Consider using Vercel Pro for longer timeouts

4. **Environment Variables**:
   - Ensure all required variables are set
   - Check variable names match exactly
   - Redeploy after adding new variables

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Payload CMS Docs**: [payloadcms.com/docs](https://payloadcms.com/docs)
- **MongoDB Atlas Docs**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

## Next Steps

After successful deployment:

1. **Custom Domain**: Add your custom domain in Vercel settings
2. **SSL Certificate**: Automatically provided by Vercel
3. **Monitoring**: Set up Vercel Analytics
4. **Backups**: Configure MongoDB Atlas backups
5. **CI/CD**: Set up automatic deployments from GitHub
