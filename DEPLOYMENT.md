# 🚀 Production Deployment Guide

## Problem: Localhost Short Links

The issue you're experiencing is that shortened links are generated with `localhost` instead of a proper domain. This happens because the application uses the current request host to generate URLs.

## ✅ Solution: Configure BASE_URL

### Quick Fix:
1. Open `backend/.env`
2. Set `BASE_URL` to your desired domain:
   ```
   BASE_URL=https://yourdomain.com
   ```
3. Restart the backend server

### For Development Testing:
```env
BASE_URL=http://localhost:5001
```

### For Production:
```env
BASE_URL=https://shortlink.pro
NODE_ENV=production
```

## 🌐 Production Deployment Steps

### 1. Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your hosting platform
```

### 2. Backend Deployment (Railway/Render/Heroku)
```bash
cd backend
# Set environment variables on your hosting platform:
BASE_URL=https://yourdomain.com
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=production
```

### 3. Domain Configuration
- Buy a domain (e.g., `shortlink.pro`)
- Point it to your backend server
- Set up SSL certificate (automatic on most platforms)
- Update `BASE_URL` environment variable

### 4. Custom Domain Setup (Advanced)
For users who want their own domain:
- Professional/Enterprise plans can use custom domains
- DNS CNAME record: `links.usercompany.com` → `shortlink.pro`
- SSL auto-provisioning

## 🔧 Environment Variables for Production

```env
# Required
BASE_URL=https://yourdomain.com
MONGO_URI=mongodb+srv://...
JWT_SECRET=super-secure-random-string
NODE_ENV=production

# Optional (for email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📱 Testing in Development

To test with a real domain locally:
1. Use a service like ngrok: `ngrok http 5001`
2. Set `BASE_URL=https://xyz.ngrok.io`
3. Short links will use the ngrok URL

## 🎯 The Result

Once configured:
- ❌ Before: `http://localhost:5001/abc123`
- ✅ After: `https://shortlink.pro/abc123`

Your users can now share these links anywhere and they'll work perfectly!

## 💡 Pro Tips

1. **Domain Suggestions**: Use short domains for better UX
   - `short.ly`, `link.co`, `go.company.com`

2. **SSL is Required**: All modern browsers require HTTPS for short links

3. **Analytics**: The click tracking will work across all domains

4. **Scaling**: Consider using a CDN for global performance

## 🚀 Deploy Now!

Your application is production-ready. Just configure `BASE_URL` and deploy!
