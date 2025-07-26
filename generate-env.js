// Generate secure environment variables for Railway deployment
import crypto from 'crypto';

console.log('🔐 Generating Secure Environment Variables for Railway\n');

console.log('='.repeat(60));
console.log('COPY THESE TO YOUR RAILWAY DASHBOARD:');
console.log('='.repeat(60));

console.log('\n📋 Required Variables:');
console.log('NODE_ENV=production');
console.log('PORT=8080');
console.log('\n🔐 Security Variables:');
console.log(`JWT_SECRET=${crypto.randomBytes(64).toString('hex')}`);

console.log('\n🌐 URL Variables (Update with your actual Railway domain):');
console.log('BASE_URL=https://your-railway-domain.railway.app');
console.log('FRONTEND_URL=https://your-railway-domain.railway.app');

console.log('\n🗄️ Database Variable:');
console.log('MONGO_URI=your_mongodb_connection_string');

console.log('\n' + '='.repeat(60));
console.log('⚠️  IMPORTANT STEPS:');
console.log('='.repeat(60));
console.log('1. Go to https://railway.app/dashboard');
console.log('2. Click your SAAS_Url_shortener project');
console.log('3. Click "Variables" tab');
console.log('4. Add each variable above');
console.log('5. Railway will auto-redeploy');
console.log('\n✅ Your app will work once all variables are set!');
