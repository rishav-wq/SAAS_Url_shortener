Write-Host "🚀 SaaS Link Shortener - Deployment Helper" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host "1. Code committed to GitHub? (y/n)" -ForegroundColor White
$github_ready = Read-Host

if ($github_ready -ne "y") {
    Write-Host "⚠️ Please commit and push your code to GitHub first:" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Ready for deployment'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "🎯 Choose your deployment platform:" -ForegroundColor Green
Write-Host "1. Railway.app (Recommended - Easy)" -ForegroundColor White
Write-Host "2. Vercel + Railway (Frontend/Backend split)" -ForegroundColor White
Write-Host "3. Heroku (Classic)" -ForegroundColor White
Write-Host "4. Other (Manual setup)" -ForegroundColor White
Write-Host ""
Write-Host "Enter your choice (1-4):" -ForegroundColor White
$platform_choice = Read-Host

switch ($platform_choice) {
    "1" {
        Write-Host ""
        Write-Host "🚂 Railway.app Deployment Selected" -ForegroundColor Blue
        Write-Host "==================================" -ForegroundColor Blue
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://railway.app" -ForegroundColor White
        Write-Host "2. Click 'Start a New Project'" -ForegroundColor White
        Write-Host "3. Select 'Deploy from GitHub repo'" -ForegroundColor White
        Write-Host "4. Choose your repository" -ForegroundColor White
        Write-Host ""
        Write-Host "🔧 Environment variables to add in Railway:" -ForegroundColor Yellow
        Write-Host "PORT=5001" -ForegroundColor Gray
        Write-Host "NODE_ENV=production" -ForegroundColor Gray
        Write-Host "MONGO_URI=mongodb+srv://rishav:rishav123456@cluster0.xjrprvm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" -ForegroundColor Gray
        Write-Host "JWT_SECRET=xjfkfj12345ff" -ForegroundColor Gray
        Write-Host "BASE_URL=https://your-railway-url.railway.app" -ForegroundColor Gray
        Write-Host "FRONTEND_URL=https://your-railway-url.railway.app" -ForegroundColor Gray
    }
    "2" {
        Write-Host ""
        Write-Host "⚡ Vercel + Railway Deployment Selected" -ForegroundColor Blue
        Write-Host "======================================" -ForegroundColor Blue
        Write-Host ""
        Write-Host "📝 Backend (Railway):" -ForegroundColor Yellow
        Write-Host "1. Go to: https://railway.app" -ForegroundColor White
        Write-Host "2. Deploy from GitHub (root directory)" -ForegroundColor White
        Write-Host ""
        Write-Host "📝 Frontend (Vercel):" -ForegroundColor Yellow
        Write-Host "1. Go to: https://vercel.com" -ForegroundColor White
        Write-Host "2. Import project, set root directory to 'frontend'" -ForegroundColor White
        Write-Host "3. Add environment variable:" -ForegroundColor White
        Write-Host "   VITE_API_BASE_URL=https://your-backend-url.railway.app/api" -ForegroundColor Gray
    }
    "3" {
        Write-Host ""
        Write-Host "🟣 Heroku Deployment Selected" -ForegroundColor Magenta
        Write-Host "=============================" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "📝 Steps:" -ForegroundColor Yellow
        Write-Host "1. Install Heroku CLI" -ForegroundColor White
        Write-Host "2. Run: heroku login" -ForegroundColor White
        Write-Host "3. Run: heroku create your-app-name" -ForegroundColor White
        Write-Host "4. Set environment variables:" -ForegroundColor White
        Write-Host "   heroku config:set PORT=5001" -ForegroundColor Gray
        Write-Host "   heroku config:set NODE_ENV=production" -ForegroundColor Gray
        Write-Host "   heroku config:set MONGO_URI=your-connection-string" -ForegroundColor Gray
        Write-Host "   heroku config:set JWT_SECRET=your-secret" -ForegroundColor Gray
        Write-Host "   heroku config:set BASE_URL=https://your-app.herokuapp.com" -ForegroundColor Gray
        Write-Host "5. Deploy: git push heroku main" -ForegroundColor White
    }
    "4" {
        Write-Host ""
        Write-Host "🔧 Manual Deployment" -ForegroundColor Yellow
        Write-Host "===================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📝 Check the DeploymentGuide.jsx component in your app" -ForegroundColor White
        Write-Host "It contains 8 different hosting platform options with" -ForegroundColor White
        Write-Host "step-by-step instructions for each platform." -ForegroundColor White
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "⚠️ IMPORTANT REMINDERS:" -ForegroundColor Red
Write-Host "• Replace placeholder URLs with your actual deployed URLs" -ForegroundColor White
Write-Host "• Test that short links work after deployment" -ForegroundColor White
Write-Host "• Check that links use your domain, not localhost" -ForegroundColor White
Write-Host ""
Write-Host "✅ Good luck with your deployment!" -ForegroundColor Green
Write-Host "📖 See DEPLOYMENT_STEPS.md for detailed instructions" -ForegroundColor Cyan
