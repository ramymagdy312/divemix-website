# 🚀 DiveMix Website Deployment Guide

This guide will help you deploy the DiveMix website to production on any server or hosting platform.

## 📋 Pre-Deployment Checklist

### ✅ Requirements

- [ ] Node.js 18+ installed
- [ ] PostgreSQL or Supabase database ready
- [ ] Domain name configured (optional)
- [ ] SSL certificate (recommended)
- [ ] Environment variables prepared

### ✅ Files Ready

- [ ] Database setup files in `database/` directory
- [ ] Environment variables configured
- [ ] Build process tested locally
- [ ] All dependencies installed

## 🗄️ Database Setup

### Step 1: Choose Your Database Setup

#### Option A: Complete Setup (Recommended)

```sql
-- Run this in your PostgreSQL console or Supabase SQL Editor
-- File: database/complete_database_setup.sql

-- This includes:
-- ✅ All tables and relationships
-- ✅ Sample data and content
-- ✅ Security policies (RLS)
-- ✅ WhatsApp integration
-- ✅ Admin panel ready
```

#### Option B: Minimal Setup

```sql
-- For custom content management
-- File: database/quick_deploy.sql

-- This includes:
-- ✅ Essential tables only
-- ✅ Basic security policies
-- ✅ Minimal sample data
-- ⚠️ Requires manual content addition
```

### Step 2: Verify Database Setup

```sql
-- Run verification script
-- File: database/verify_setup.sql

-- This will check:
-- ✅ Table creation
-- ✅ Data population
-- ✅ Security policies
-- ✅ Performance indexes
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

#### Why Vercel?

- ✅ **Zero Configuration** - Works out of the box
- ✅ **Automatic Deployments** - Deploy on git push
- ✅ **Global CDN** - Fast worldwide performance
- ✅ **SSL Included** - HTTPS by default
- ✅ **Environment Variables** - Easy configuration

#### Steps:

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_WHATSAPP_NUMBER=+201010606967
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build completion
   - Your site is live! 🎉

### Option 2: Netlify

#### Steps:

1. **Build the project:**

   ```bash
   npm run build
   npm run export  # If using static export
   ```

2. **Deploy to Netlify:**

   - Drag and drop `out/` folder to Netlify
   - Or connect GitHub repository

3. **Configure Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add all required variables

### Option 3: DigitalOcean App Platform

#### Steps:

1. **Create App:**

   - Connect GitHub repository
   - Select Node.js environment

2. **Configure Build:**
   ```yaml
   # .do/app.yaml
   name: divemix-website
   services:
     - name: web
       source_dir: /
       github:
         repo: your-username/divemix-website
         branch: main
       run_command: npm start
       build_command: npm run build
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: NEXT_PUBLIC_SUPABASE_URL
           value: your_supabase_url
         - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
           value: your_supabase_anon_key
   ```

### Option 4: Self-Hosted (VPS/Dedicated Server)

#### Requirements:

- Ubuntu 20.04+ or similar
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

#### Steps:

1. **Server Setup:**

   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Deploy Application:**

   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd divemix-website

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "divemix" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx:**

   ```nginx
   # /etc/nginx/sites-available/divemix
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable Site:**

   ```bash
   sudo ln -s /etc/nginx/sites-available/divemix /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **SSL Certificate:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## 🔧 Environment Variables

### Required Variables:

```env
# Database (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# WhatsApp Integration (Required)
NEXT_PUBLIC_WHATSAPP_NUMBER=+201010606967

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Analytics
NEXT_PUBLIC_GA_ID=GA-XXXXXXXXX

# Optional: Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Security Notes:

- ⚠️ **Never commit `.env.local`** to version control
- ✅ **Use environment variables** in production
- ✅ **Rotate keys regularly** for security
- ✅ **Use different keys** for development/production

## 🔍 Post-Deployment Verification

### 1. Test Website Functionality

- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Images display properly
- [ ] Contact form works
- [ ] WhatsApp integration works
- [ ] Admin panel accessible

### 2. Test Database Connection

```bash
# Visit your deployed site
https://your-domain.com/api/health

# Should return:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-XX..."
}
```

### 3. Performance Check

- [ ] Page load speed < 3 seconds
- [ ] Images optimized and loading
- [ ] Mobile responsiveness
- [ ] SEO meta tags present

### 4. Security Check

- [ ] HTTPS enabled
- [ ] Environment variables secure
- [ ] Database access restricted
- [ ] Admin panel protected

## 🚨 Troubleshooting

### Common Issues:

#### 1. Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### 2. Database Connection Issues

- ✅ Check environment variables
- ✅ Verify Supabase project status
- ✅ Test database connectivity
- ✅ Check RLS policies

#### 3. Image Loading Issues

- ✅ Verify image paths in database
- ✅ Check public folder structure
- ✅ Ensure images are optimized

#### 4. WhatsApp Integration Not Working

- ✅ Check `NEXT_PUBLIC_WHATSAPP_NUMBER` format
- ✅ Verify WhatsApp settings in database
- ✅ Test WhatsApp URL generation

### Debug Commands:

```bash
# Check logs (PM2)
pm2 logs divemix

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test database connection
npm run test:db

# Verify build
npm run build && npm start
```

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring

- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Performance:** Google PageSpeed Insights
- **Analytics:** Google Analytics
- **Error Tracking:** Sentry (optional)

### 2. Regular Maintenance

- [ ] **Weekly:** Check site performance
- [ ] **Monthly:** Update dependencies
- [ ] **Quarterly:** Security audit
- [ ] **As needed:** Content updates via admin panel

### 3. Backup Strategy

```bash
# Database backup (run weekly)
pg_dump -h hostname -U username -d database_name > backup_$(date +%Y%m%d).sql

# Code backup (automatic with git)
git push origin main
```

## 🎉 Success!

Your DiveMix website is now live! 🚀

### Next Steps:

1. **Test all functionality** thoroughly
2. **Set up monitoring** for uptime and performance
3. **Configure backups** for database and files
4. **Train team** on admin panel usage
5. **Plan content updates** and maintenance schedule

### Support:

- 📧 **Email:** info@divemix.com
- 📱 **WhatsApp:** +201010606967
- 🌐 **Website:** [divemix.com](https://divemix.com)

---

**🎊 Congratulations! Your DiveMix website is ready to serve customers worldwide!**
