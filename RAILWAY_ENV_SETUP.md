# 🔐 Railway Environment Variables Setup Guide

## ⚠️ IMPORTANT: Set These in Railway Dashboard

Railway does NOT automatically read .env files. You must set these manually in the Railway dashboard:

### 📍 How to Add Environment Variables to Railway:

1. Go to: https://railway.app/dashboard
2. Click on your "SAAS_Url_shortener" project
3. Click on your service
4. Go to "Variables" tab
5. Click "Add Variable" for each of these:

### 🔧 Required Environment Variables:

```bash
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://rishav:rishav123456@cluster0.xjrprvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=xjfkfj12345ff
BASE_URL=https://saas-url-shortener-production.up.railway.app
FRONTEND_URL=https://saas-url-shortener-production.up.railway.app
```

## 🚨 Security Recommendations:

### 1. Create New MongoDB User:
- Go to MongoDB Atlas
- Create a new database user specifically for production
- Use a strong, unique password
- Update MONGO_URI with new credentials

### 2. Generate Stronger JWT Secret:
```bash
# Use this command to generate a secure JWT secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Update BASE_URL:
Replace with your actual Railway domain once deployed.

## 🔄 After Adding Variables:

1. Railway will automatically redeploy
2. Check deployment logs for any errors
3. Test your app at the deployed URL

## ✅ Verification:

Your app should work at:
- Frontend: https://your-railway-domain.railway.app
- API Health: https://your-railway-domain.railway.app/api/health
- API Base: https://your-railway-domain.railway.app/api

---

**Note:** Railway deployments fail without proper environment variables. This is why your deployment isn't working - the server can't connect to MongoDB without the MONGO_URI variable set in Railway.
