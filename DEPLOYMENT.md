# Deployment Guide for codemify.com/demo-app

This guide provides step-by-step instructions to deploy the Codemify Demo App to **https://codemify.com/demo-app**.

## 📋 Prerequisites

- [ ] GitHub repository (https://github.com/lucas-108/codemify-demo-app)
- [ ] Domain name (codemify.com) with access to DNS settings
- [ ] Vercel account (free tier available)

## 🚀 Option 1: Deploy with Vercel (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Update Frontend API URL

Before deploying, update the frontend to use environment variables for the API URL:

1. Create `.env.production` in the frontend directory:

```
REACT_APP_API_URL=https://codemify.com/demo-app/api
```

2. Set the homepage in `frontend/package.json`:

```json
"homepage": "/demo-app"
```

3. Update `frontend/src/App.js` to use this URL (already configured with environment variables)

### Step 4: Add Build Script to Root

Create `package.json` in the root directory:

```json
{
  "name": "codemify-demo-app",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "install-backend": "cd backend && npm install"
  }
}
```

### Step 5: Deploy to Vercel

From the project root:

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name: **codemify-demo-app**
- Directory: **./** (root)

### Step 6: Configure Custom Domain

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Domains**
4. Add **codemify.com** as your domain
5. Configure path rewrites for `/demo-app` subdirectory

### Step 7: Configure Routing for Subdirectory

Since the app will be hosted at `/demo-app`, you have two options:

**Option A: Using Vercel with existing site**

- Your main site remains at `codemify.com`
- Deploy this app as a separate Vercel project
- Use Vercel's path rewrites or deploy to `demo-app.codemify.com` and use a reverse proxy

**Option B: Deploy to existing server**

- Build the frontend: `cd frontend && npm run build`
- Copy `build/` folder to your server's `/demo-app` directory
- Ensure `.htaccess` or nginx config handles SPA routing

### Step 8: Verify Deployment

Once deployed:

- Visit https://codemify.com/demo-app
- Verify SSL certificate is active
- Test all features (product list, cart, checkout)
- Verify API calls work at https://codemify.com/demo-app/api/products

---

## 🌐 Option 2: Deploy with AWS

### Architecture

- **Frontend**: S3 + CloudFront
- **Backend**: EC2 + PM2
- **Database**: Products.json (or migrate to RDS/DynamoDB)
- **Domain**: Route 53

### Step 1: Build Frontend

```bash
cd frontend
npm install
npm run build
```

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://codemify-frontend
aws s3 sync build/ s3://codemify-frontend --acl public-read
```

### Step 3: Configure CloudFront

1. Create CloudFront distribution pointing to S3 bucket
2. Set alternate domain name: codemify.com
3. Request SSL certificate via AWS Certificate Manager
4. Update Route 53 A record to point to CloudFront

### Step 4: Deploy Backend to EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js and PM2:

```bash
sudo apt update
sudo apt install nodejs npm
sudo npm install -g pm2
```

4. Clone repository:

```bash
git clone https://github.com/lucas-108/codemify-demo-app
cd codemify-demo-app/backend
npm install
```

5. Start with PM2:

```bash
pm2 start server.js --name codemify-backend
pm2 startup
pm2 save
```

6. Configure Nginx as reverse proxy:

```bash
sudo apt install nginx
```

Create `/etc/nginx/sites-available/codemify`:

```nginx
server {
    listen 80;
    server_name api.codemify.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/codemify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. Install Certbot for SSL:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.codemify.com
```

### Step 5: Update Route 53

Create A records:

- **codemify.com** → CloudFront distribution
- **api.codemify.com** → EC2 elastic IP

---

## 🐳 Option 3: Deploy with Docker + DigitalOcean

### Step 1: Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create docker-compose.yml

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    volumes:
      - ./backend/products.json:/app/products.json
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Step 3: Deploy to DigitalOcean

1. Create DigitalOcean Droplet (Ubuntu)
2. SSH into droplet
3. Install Docker and Docker Compose
4. Clone repository
5. Run `docker-compose up -d`
6. Configure domain DNS to point to droplet IP

---

## 🔧 Required Code Changes

### Update Frontend API URL

Edit `frontend/src/App.js`:

```javascript
// Add at the top of the file
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// Replace all fetch calls from 'http://localhost:4000' to `${API_URL}`
// Example:
fetch(`${API_URL}/api/products`);
```

### Update Backend for Production

Edit `backend/server.js`:

```javascript
const PORT = process.env.PORT || 4000;

// Add production-ready error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
```

---

## 📊 Post-Deployment Checklist

- [ ] Verify frontend loads at https://codemify.com
- [ ] Test API endpoints work correctly
- [ ] Check SSL certificate is valid
- [ ] Test shopping cart functionality
- [ ] Test checkout flow
- [ ] Verify mobile responsiveness
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## 🔐 Security Recommendations

1. **Enable HTTPS** - Always use SSL certificates
2. **Environment Variables** - Store sensitive data in env vars
3. **Rate Limiting** - Add rate limiting to API endpoints
4. **CORS Configuration** - Restrict origins in production
5. **Input Validation** - Validate all user inputs
6. **Security Headers** - Add helmet.js to backend

---

## 📈 Monitoring & Analytics

- **Vercel Analytics** (if using Vercel)
- **Google Analytics** for user behavior
- **Sentry** for error tracking
- **LogRocket** for session replay
- **UptimeRobot** for uptime monitoring

---

## 🆘 Troubleshooting

**Issue**: API calls fail after deployment
**Solution**: Check CORS configuration and API URL environment variable

**Issue**: Images not loading
**Solution**: Verify image URLs are absolute paths

**Issue**: 404 errors on refresh
**Solution**: Configure proper routing (add \_redirects file for Netlify or vercel.json)

---

## 📞 Support

For deployment issues, refer to:

- Vercel Docs: https://vercel.com/docs
- AWS Docs: https://docs.aws.amazon.com
- DigitalOcean Docs: https://docs.digitalocean.com

Good luck with your deployment! 🚀
