# 🚀 Quick Deployment to https://codemify.com/demo-app

## TL;DR - Fastest Way to Deploy

### If you have cPanel or similar hosting:

1. **Build the app:**

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload `frontend/build/*` to `/public_html/demo-app/` via File Manager**

3. **Upload backend to separate directory and start it**

4. **Done!** Visit https://codemify.com/demo-app

---

### If you use Vercel/Netlify:

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel --prod
   ```

3. **Configure domain in Vercel dashboard to point `codemify.com/demo-app`**

---

### If you have SSH access:

```bash
# Build
cd frontend && npm install && npm run build

# Upload
scp -r build/* user@codemify.com:/var/www/html/demo-app/

# Backend
scp -r ../backend user@codemify.com:/var/www/
ssh user@codemify.com
cd /var/www/backend
npm install
npm install -g pm2
pm2 start server.js --name demo-backend
```

---

## Configuration Summary

All files are already configured for `/demo-app`:

| File                        | Purpose        | Status                     |
| --------------------------- | -------------- | -------------------------- |
| `frontend/.env.production`  | API URL        | ✅ Set to `/demo-app/api`  |
| `frontend/package.json`     | Base path      | ✅ `homepage: "/demo-app"` |
| `frontend/public/.htaccess` | Apache routing | ✅ Configured              |
| `frontend/nginx.conf`       | Nginx config   | ✅ Configured              |
| `vercel.json`               | Vercel routing | ✅ Configured              |

---

## What You Need

### Required:

- ✅ Access to codemify.com server/hosting
- ✅ Node.js installed locally (to build)
- ✅ FTP/SSH access to upload files

### Optional:

- Backend hosting (can use serverless)
- PM2 for process management
- Nginx or Apache web server

---

## After Deployment

Test these URLs:

1. **Frontend:** https://codemify.com/demo-app
2. **API:** https://codemify.com/demo-app/api/products
3. **Cart (SPA routing):** https://codemify.com/demo-app/cart

---

## Full Documentation

- **Detailed Guide:** [SUBDIRECTORY-DEPLOYMENT.md](./SUBDIRECTORY-DEPLOYMENT.md)
- **All Options:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Troubleshooting:** Check console errors, server logs

---

**Need help?** Check the detailed deployment guides or test the app locally first with `npm start`.
