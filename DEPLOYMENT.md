# Deployment Guide

Complete guide to deploying your Mukhayam Tulaabi Foundation app to various hosting platforms.

## Prerequisites for All Platforms

1. **MongoDB Database** (Choose one):
   - MongoDB Atlas (Free tier available)
   - Self-hosted MongoDB

2. **Environment Variables** (from .env.example):
   ```
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=your-connection-string
   SESSION_SECRET=strong-random-string
   ```

## Option 1: Vercel + MongoDB Atlas (Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account and cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

### Step 2: Deploy to Vercel
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI` = your connection string
   - `SESSION_SECRET` = random string
   - `NODE_ENV` = production

5. Deploy!

### Example Vercel Configuration
```json
{
  "buildCommand": "npm install",
  "outputDirectory": "public",
  "envPrefix": ""
}
```

**Pros**: Free, easy, fast deployments
**Cons**: Serverless limitations, stateless functions

## Option 2: Heroku (Free tier ended, but still good for paid)

### Step 1: Create Heroku Account
- Go to https://www.heroku.com

### Step 2: Deploy via Heroku CLI
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB connection
heroku config:set MONGODB_URI=your-connection-string
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Pros**: Simple deployment, good free resources
**Cons**: Paid plans, slow startup times

## Option 3: Railway (Best Free Option)

### Step 1: Create Railway Account
- Go to https://railway.app
- Connect GitHub account

### Step 2: Deploy
1. Create new project
2. Connect to GitHub repository
3. Add environment variables in Dashboard
4. Railway automatically deploys on push to main

### Example Railway Variables
```
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=your-secret
NODE_ENV=production
PORT=3000
```

**Pros**: Free, simple, good limits
**Cons**: Newer platform, less documentation

## Option 4: DigitalOcean (Paid, Full Control)

### Step 1: Create Droplet
- Create Ubuntu 20.04 droplet (2GB RAM recommended)
- SSH into your droplet

### Step 2: Set Up Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (or use Atlas)
# Or connect to MongoDB Atlas with connection string

# Install Git
sudo apt install git

# Clone your repository
git clone your-repo-url
cd your-repo

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Install PM2 (process manager)
sudo npm install -g pm2

# Start app
pm2 start server.js --name "mukhayam-tulaabi"
pm2 startup
pm2 save

# Install Nginx (reverse proxy)
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

### Example Nginx Configuration
```nginx
server {
    listen 80 default_server;
    server_name _;

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

### Set Up HTTPS (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

**Pros**: Full control, good performance, reasonable cost
**Cons**: More setup required, need to manage server

## Option 5: AWS EC2 (Enterprise)

### Step 1: Create EC2 Instance
- Launch Ubuntu 20.04 instance
- Configure security groups (allow 80, 443, 22)

### Step 2: Deploy
Same as DigitalOcean setup above, but use AWS Console to manage instance

### Step 3: Use RDS for Database
- Create RDS MongoDB cluster
- Use connection string in environment variables

**Pros**: Scalable, reliable, enterprise support
**Cons**: Complex setup, can be expensive

## Option 6: cPanel/Shared Hosting (Traditional)

### If Your Hosting Supports Node.js:

1. Upload files via FTP/File Manager
2. Create Node.js application in cPanel
3. Set port (usually assigned automatically)
4. Set environment variables
5. Start application

### If Node.js Not Supported:
- Use Cloudflare Workers
- Use Replit
- Consider upgrading hosting provider

## Environment Variables Checklist

For any platform, ensure these are set:

```
✓ PORT = 3000 (or assigned by platform)
✓ NODE_ENV = production
✓ MONGODB_URI = your-connection-string
✓ SESSION_SECRET = strong-random-string (min 16 chars)
✓ CORS_ORIGIN = your-domain.com (optional)
```

## Post-Deployment Checklist

- [ ] Test public dashboard works
- [ ] Test admin login (PIN: 5022)
- [ ] Add a test donor
- [ ] Add a test expense
- [ ] Delete test entries
- [ ] Check that data persists after refresh
- [ ] Monitor error logs
- [ ] Set up backups for MongoDB
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerts
- [ ] Change default admin PIN
- [ ] Update homepage with production URL

## Monitoring & Maintenance

### Set Up Logs
```bash
# PM2 logs
pm2 logs mukhayam-tulaabi

# View MongoDB logs
heroku logs --tail  # if on Heroku
```

### Database Backups
```bash
# MongoDB Atlas: Automatic backups included

# Self-hosted:
mongoexport --uri "mongodb://localhost:27017/mukhayam-tulaabi" --out backup.json

# Restore:
mongoimport --uri "mongodb://localhost:27017/mukhayam-tulaabi" --file backup.json
```

### Update Dependencies
```bash
npm outdated  # Check for updates
npm update    # Update all
npm audit fix # Fix security issues
```

## Troubleshooting Deployment

### App crashes on startup
- Check MONGODB_URI
- Verify environment variables are set
- Check logs for error messages
- Ensure Node version is 14+

### Cannot connect to MongoDB
- Verify connection string
- Check MongoDB is running
- Whitelist IP address (if Atlas)
- Check username/password

### CORS errors
- Update CORS_ORIGIN environment variable
- Check request origin matches
- Verify headers in requests

### Slow performance
- Check database indexes
- Monitor server CPU/RAM
- Use CDN for static files
- Consider upgrading instance

## Cost Estimation

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Vercel | Yes (limited) | $20/month+ |
| Heroku | Ended | $7/month |
| Railway | Yes | $5/month+ |
| DigitalOcean | No | $6+/month |
| MongoDB Atlas | 512MB | Varies |
| AWS | Free year | Complex pricing |

## Recommended for Beginners
1. **Railway** - Easiest free option
2. **Vercel** - Good free tier
3. **MongoDB Atlas** - Free database tier

## Recommended for Production
1. **DigitalOcean** - Good balance of price and features
2. **AWS** - Enterprise grade
3. **MongoDB Atlas** - Managed database

## Additional Resources

- Vercel Docs: https://vercel.com/docs
- Heroku Docs: https://devcenter.heroku.com
- Railway Docs: https://docs.railway.app
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

Choose the platform that best fits your needs and budget. Start with a free option and upgrade as your app grows!
