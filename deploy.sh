#!/bin/bash

echo "🚀 SaaS Link Shortener - Deployment Helper"
echo "========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this from the project root directory"
    exit 1
fi

echo ""
echo "📋 Pre-deployment checklist:"
echo "1. Code committed to GitHub? (y/n)"
read -r github_ready

if [ "$github_ready" != "y" ]; then
    echo "⚠️ Please commit and push your code to GitHub first:"
    echo "   git add ."
    echo "   git commit -m 'Ready for deployment'"
    echo "   git push origin main"
    exit 1
fi

echo ""
echo "🎯 Choose your deployment platform:"
echo "1. Railway.app (Recommended - Easy)"
echo "2. Vercel + Railway (Frontend/Backend split)"
echo "3. Heroku (Classic)"
echo "4. Other (Manual setup)"
echo ""
echo "Enter your choice (1-4):"
read -r platform_choice

case $platform_choice in
    1)
        echo ""
        echo "🚂 Railway.app Deployment Selected"
        echo "=================================="
        echo ""
        echo "📝 Next steps:"
        echo "1. Go to: https://railway.app"
        echo "2. Click 'Start a New Project'"
        echo "3. Select 'Deploy from GitHub repo'"
        echo "4. Choose your repository"
        echo ""
        echo "🔧 Environment variables to add in Railway:"
        echo "PORT=5001"
        echo "NODE_ENV=production"
        echo "MONGO_URI=mongodb+srv://rishav:rishav123456@cluster0.xjrprvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        echo "JWT_SECRET=xjfkfj12345ff"
        echo "BASE_URL=https://your-railway-url.railway.app"
        echo "FRONTEND_URL=https://your-railway-url.railway.app"
        ;;
    2)
        echo ""
        echo "⚡ Vercel + Railway Deployment Selected"
        echo "======================================"
        echo ""
        echo "📝 Backend (Railway):"
        echo "1. Go to: https://railway.app"
        echo "2. Deploy from GitHub (root directory)"
        echo ""
        echo "📝 Frontend (Vercel):"
        echo "1. Go to: https://vercel.com"
        echo "2. Import project, set root directory to 'frontend'"
        echo "3. Add environment variable:"
        echo "   VITE_API_BASE_URL=https://your-backend-url.railway.app/api"
        ;;
    3)
        echo ""
        echo "🟣 Heroku Deployment Selected"
        echo "============================="
        echo ""
        echo "📝 Steps:"
        echo "1. Install Heroku CLI"
        echo "2. Run: heroku login"
        echo "3. Run: heroku create your-app-name"
        echo "4. Set environment variables:"
        echo "   heroku config:set PORT=5001"
        echo "   heroku config:set NODE_ENV=production"
        echo "   heroku config:set MONGO_URI=your-connection-string"
        echo "   heroku config:set JWT_SECRET=your-secret"
        echo "   heroku config:set BASE_URL=https://your-app.herokuapp.com"
        echo "5. Deploy: git push heroku main"
        ;;
    4)
        echo ""
        echo "🔧 Manual Deployment"
        echo "==================="
        echo ""
        echo "📝 Check the DeploymentGuide.jsx component in your app"
        echo "It contains 8 different hosting platform options with"
        echo "step-by-step instructions for each platform."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "⚠️ IMPORTANT REMINDERS:"
echo "• Replace placeholder URLs with your actual deployed URLs"
echo "• Test that short links work after deployment"
echo "• Check that links use your domain, not localhost"
echo ""
echo "✅ Good luck with your deployment!"
echo "📖 See DEPLOYMENT_STEPS.md for detailed instructions"
