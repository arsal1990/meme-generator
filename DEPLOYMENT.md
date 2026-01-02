# Deployment Guide

This guide covers deploying your meme app to production.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (see `TESTING_GUIDE.md`)
- [ ] No console errors in development
- [ ] Instant DB schema is properly configured
- [ ] All TypeScript types are correct: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest option for Next.js apps.

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Configuration

**No environment variables needed!** The Instant DB App ID is in the code.

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

## Option 2: Deploy to Netlify

### Steps

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Push to GitHub** (same as Vercel)

3. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect to GitHub
   - Select your repository

4. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your app is live!

## Option 3: Docker Deployment

### Dockerfile

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t meme-app .

# Run container
docker run -p 3000:3000 meme-app
```

## Option 4: Traditional VPS (DigitalOcean, AWS, etc.)

### Requirements

- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

### Steps

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone your repository**
   ```bash
   git clone <your-repo-url>
   cd meme-app
   ```

5. **Install dependencies and build**
   ```bash
   npm install
   npm run build
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "meme-app" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx** (optional, for custom domain)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment

### Verify Deployment

1. **Check the site loads**
   - Visit your deployed URL
   - Verify homepage loads without errors

2. **Test authentication**
   - Try logging in
   - Verify email codes are sent

3. **Test core features**
   - Create a meme
   - Post to feed
   - Upvote a meme

4. **Check real-time updates**
   - Open site in two tabs
   - Post meme in one
   - Verify it appears in the other

### Monitor Performance

Use these tools to monitor your deployed app:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: Add tracking code
- **Sentry**: Error tracking and monitoring
- **Instant DB Dashboard**: Monitor database usage

### Set Up Alerts

Configure alerts for:
- Deployment failures
- High error rates
- Database quota limits
- Downtime

## Scaling Considerations

### Database Limits

Instant DB free tier includes:
- 10,000 writes/month
- 100,000 reads/month
- 1GB storage

**If you exceed limits:**
- Upgrade to Instant DB paid plan
- Implement image compression
- Add pagination to feed
- Cache frequently accessed data

### Performance Optimization

1. **Enable Image Optimization**
   - Use Next.js Image component for templates
   - Compress uploaded images before storing

2. **Add Caching**
   - Cache meme feed data
   - Use CDN for static assets

3. **Lazy Loading**
   - Implement infinite scroll for feed
   - Load images on demand

## Troubleshooting Deployment Issues

### Build Fails

**Error**: "Type errors"
```bash
# Fix locally first
npm run type-check
# Fix all errors, then deploy
```

**Error**: "Module not found"
```bash
# Ensure all dependencies are in package.json
npm install --save <missing-package>
```

### Runtime Errors

**Error**: "Cannot connect to Instant DB"
- Verify App ID is correct
- Check Instant DB dashboard for issues
- Ensure schema is configured

**Error**: "Images not loading"
- Check CORS settings
- Verify image URLs are accessible
- Test with template images first

### Performance Issues

**Slow page loads**
- Enable Next.js image optimization
- Compress images before upload
- Add loading states

**High database usage**
- Implement pagination
- Add caching layer
- Optimize queries

## Security Checklist

Before going live:

- [ ] No sensitive data in code
- [ ] Environment variables properly configured
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection (built into Next.js)

## Maintenance

### Regular Tasks

**Weekly**:
- Check error logs
- Monitor database usage
- Review performance metrics

**Monthly**:
- Update dependencies: `npm update`
- Review and optimize database
- Check for security updates

**As Needed**:
- Scale infrastructure
- Add new features
- Fix reported bugs

## Rollback Procedure

If deployment fails:

**Vercel/Netlify**:
1. Go to deployments page
2. Find previous working deployment
3. Click "Promote to Production"

**VPS/Docker**:
```bash
# Revert to previous commit
git revert HEAD
git push

# Or rollback to specific commit
git reset --hard <commit-hash>
git push --force
```

## Support

Need help with deployment?
- Check Vercel/Netlify documentation
- Review Next.js deployment docs
- Open an issue on GitHub
- Check Instant DB support

---

**Congratulations on deploying your meme app! 🚀**

