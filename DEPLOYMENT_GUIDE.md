# CredX Website Deployment Guide

## Prerequisites
- Domain: credxme.com (registered)
- Build tools: Node.js installed
- Hosting: Vercel (recommended) or Netlify

## Step 1: Build Production Version

```bash
cd /root/.openclaw/workspace/credx/frontend
npm install
npm run build
```

This creates a `dist` folder with production files.

## Step 2: Deploy to Vercel (Recommended)

### Option A: CLI Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /root/.openclaw/workspace/credx/frontend
vercel --prod
```

### Option B: Git Deployment (Recommended)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Auto-deploy on every push

```bash
# Add GitHub remote
cd /root/.openclaw/workspace/credx
git remote add origin https://github.com/yourusername/credx.git

# Push code
git push -u origin master
```

### Option C: Manual Upload
1. Build: `npm run build`
2. Go to https://vercel.com
3. Drag `dist` folder to deploy

## Step 3: Connect Custom Domain

In Vercel Dashboard:
1. Go to Project → Settings → Domains
2. Add: `credxme.com`
3. Add: `www.credxme.com`
4. Vercel will give you DNS records

## Step 4: Configure DNS

In your domain registrar (where you bought credxme.com):

### For Vercel:
| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### Or use nameservers:
Change nameservers to Vercel's:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

## Step 5: Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL=https://api.credxme.com
```

## Step 6: Backend Deployment

Deploy backend separately to Railway/Render/Heroku:

```bash
cd /root/.openclaw/workspace/credx/backend
# Follow platform-specific instructions
```

Update frontend API URL to point to deployed backend.

## Quick Deploy Script

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying CredX..."

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Deploy to Vercel
vercel --prod

echo "✅ Deployment complete!"
echo "Check: https://credxme.com"
```

## Post-Deploy Checklist

- [ ] Website loads at credxme.com
- [ ] SSL certificate active (HTTPS)
- [ ] Lead form submits to backend
- [ ] All images load correctly
- [ ] Mobile responsive
- [ ] Page speed < 3 seconds
- [ ] Meta tags for SEO
- [ ] Favicon displays
- [ ] Analytics tracking (Google Analytics)
- [ ] Facebook Pixel installed

## Troubleshooting

### Build fails
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Domain not connecting
- Check DNS propagation: `dig credxme.com`
- Wait 24-48 hours for DNS
- Verify SSL certificate issued

### API calls fail
- Check CORS settings in backend
- Verify API URL is correct
- Check network tab for errors

## Monitoring

Set up:
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)

## Cost Estimate

| Service | Cost |
|---------|------|
| Vercel Pro | $20/month |
| Domain | $12/year |
| Railway/Render Backend | $5-20/month |
| **Total** | **$25-40/month** |

## Next Steps After Deploy

1. Submit sitemap to Google Search Console
2. Set up Google Analytics
3. Add Facebook Pixel
4. Test all forms
5. Enable CDN caching
6. Set up backups
