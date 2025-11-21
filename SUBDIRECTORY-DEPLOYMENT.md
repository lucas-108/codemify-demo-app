# Deploying to https://codemify.com/demo-app

This guide covers deploying the demo app to a **subdirectory** of your existing website.

## ✅ Configuration Already Complete

The following files have been configured for `/demo-app` subdirectory deployment:

- ✅ `frontend/.env.production` - API URL set to `/demo-app/api`
- ✅ `frontend/package.json` - Homepage set to `/demo-app`
- ✅ `frontend/public/.htaccess` - Apache rewrite rules for SPA routing
- ✅ `frontend/nginx.conf` - Nginx configuration for subdirectory
- ✅ `vercel.json` - Vercel routing configuration

## 🚀 Deployment Options

### Option 1: Add to Existing Server (Recommended if you already host codemify.com)

#### Step 1: Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `build/` folder with optimized production files.

#### Step 2: Upload to Your Server

**Via SFTP/SCP:**

```bash
# Upload the built files to /demo-app directory
scp -r frontend/build/* user@codemify.com:/var/www/html/demo-app/
```

**Or via FTP:**

- Upload contents of `frontend/build/` to your server's `/demo-app` directory

#### Step 3: Deploy Backend

**Option A: Same server**

```bash
# Upload backend files
scp -r backend/* user@codemify.com:/var/www/demo-app-backend/

# SSH into server
ssh user@codemify.com

# Install dependencies and start
cd /var/www/demo-app-backend
npm install
npm install -g pm2
pm2 start server.js --name codemify-demo-backend
pm2 save
```

**Option B: Use serverless (Vercel/Netlify Functions)**

- Deploy backend as serverless functions
- Update API_URL in `.env.production`

#### Step 4: Configure Web Server

**For Apache (.htaccess is already included)**

Make sure `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

The `.htaccess` file will handle SPA routing automatically.

**For Nginx**

Add to your nginx configuration:

```nginx
# In your existing server block for codemify.com
server {
    listen 443 ssl http2;
    server_name codemify.com;

    # Your existing configuration...

    # Add this location block for the demo app
    location /demo-app {
        alias /var/www/html/demo-app;
        try_files $uri $uri/ /demo-app/index.html;

        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to backend
    location /demo-app/api {
        proxy_pass http://localhost:4000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### Option 2: Separate Subdomain (Easier Alternative)

Instead of `/demo-app`, use `demo-app.codemify.com`:

1. **Update environment variables:**

   ```bash
   # frontend/.env.production
   REACT_APP_API_URL=https://demo-app.codemify.com/api
   ```

2. **Remove homepage from package.json:**

   ```json
   // frontend/package.json - remove this line:
   "homepage": "/demo-app"
   ```

3. **Deploy to Vercel/Netlify:**

   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

4. **Add DNS record:**
   ```
   Type: CNAME
   Name: demo-app
   Value: <your-vercel-deployment>.vercel.app
   ```

---

### Option 3: Using Docker on Existing Server

If your server supports Docker:

```bash
# SSH into your server
ssh user@codemify.com

# Clone the repository
git clone https://github.com/lucas-108/codemify-demo-app.git
cd codemify-demo-app

# Build and run with Docker Compose
docker-compose up -d

# Configure nginx to proxy to Docker containers
# Frontend: http://localhost:80/demo-app
# Backend: http://localhost:4000/api
```

Add to nginx config:

```nginx
location /demo-app {
    proxy_pass http://localhost:80/demo-app;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

---

## 🧪 Testing Your Deployment

### 1. Test Frontend

Visit: `https://codemify.com/demo-app`

**Should see:**

- ✅ Product catalog loads
- ✅ All images display correctly
- ✅ Navigation works
- ✅ No console errors

### 2. Test Backend API

Visit: `https://codemify.com/demo-app/api/products`

**Should see:**

- ✅ JSON array of products
- ✅ No CORS errors

### 3. Test Shopping Flow

- ✅ Add products to cart
- ✅ Update quantities
- ✅ Navigate to checkout
- ✅ Cart persists on page refresh

### 4. Test Direct URL Navigation

Visit: `https://codemify.com/demo-app/cart`

**Should:**

- ✅ Load the cart page (not 404)
- ✅ Show proper content

---

## 🔧 Common Issues & Solutions

### Issue 1: 404 on Page Refresh

**Problem:** Refreshing the page at `/demo-app/cart` gives 404

**Solution (Apache):**

- Ensure `.htaccess` is uploaded
- Check `AllowOverride All` in Apache config
- Enable mod_rewrite

**Solution (Nginx):**

- Add `try_files $uri $uri/ /demo-app/index.html;`
- Reload nginx

### Issue 2: API Calls Fail

**Problem:** API requests return 404 or CORS errors

**Solution:**

1. Check backend is running: `pm2 status`
2. Verify proxy configuration in nginx/apache
3. Check CORS settings in `backend/server.js`
4. Test API directly: `curl https://codemify.com/demo-app/api/products`

### Issue 3: Assets Not Loading

**Problem:** CSS/JS/Images return 404

**Solution:**

1. Verify `homepage` in `package.json` is set to `/demo-app`
2. Rebuild: `npm run build`
3. Check file paths in nginx/apache config
4. Ensure files are uploaded to correct directory

### Issue 4: Blank White Page

**Problem:** Page loads but shows nothing

**Solution:**

1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify `PUBLIC_URL` environment variable
4. Rebuild with: `PUBLIC_URL=/demo-app npm run build`

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `frontend/.env.production` has correct API URL
- [ ] `frontend/package.json` has `"homepage": "/demo-app"`
- [ ] Backend is configured to handle `/api` routes
- [ ] CORS is configured to allow your domain
- [ ] SSL certificate covers codemify.com
- [ ] Web server config includes proxy rules for `/demo-app`
- [ ] Backend is running (if self-hosted)

---

## 🚀 Quick Deploy Commands

**Full deployment to existing server:**

```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Upload to server
scp -r build/* user@codemify.com:/var/www/html/demo-app/

# 3. Deploy backend
scp -r ../backend/* user@codemify.com:/var/www/demo-app-backend/
ssh user@codemify.com "cd /var/www/demo-app-backend && npm install && pm2 restart codemify-demo-backend || pm2 start server.js --name codemify-demo-backend"

# 4. Test
curl https://codemify.com/demo-app/api/products
```

---

## 📊 Monitoring

After deployment, monitor:

1. **Server Resources**

   ```bash
   pm2 monit  # Monitor backend process
   ```

2. **Logs**

   ```bash
   pm2 logs codemify-demo-backend
   tail -f /var/log/nginx/access.log
   ```

3. **Uptime**
   - Set up UptimeRobot for `https://codemify.com/demo-app`
   - Monitor API: `https://codemify.com/demo-app/api/products`

---

## 🔐 Security Recommendations

1. **Rate Limiting** - Add rate limiting to API endpoints
2. **HTTPS Only** - Redirect HTTP to HTTPS
3. **Security Headers** - Add security headers in nginx/apache
4. **Environment Variables** - Never commit `.env` files
5. **Regular Updates** - Keep dependencies updated

---

## 📞 Need Help?

- Check browser console for errors
- Review server logs: `pm2 logs` or `/var/log/nginx/error.log`
- Test API independently: `curl -v https://codemify.com/demo-app/api/products`
- Verify DNS: `nslookup codemify.com`

Good luck with your deployment! 🎉
