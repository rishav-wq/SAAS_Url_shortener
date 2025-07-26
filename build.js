#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting build process...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('Created dist directory');
}

// Check if frontend/dist exists and copy files
const frontendDistDir = path.join(__dirname, 'frontend', 'dist');
if (fs.existsSync(frontendDistDir)) {
    console.log('Copying files from frontend/dist to dist/');
    execSync('cp -r frontend/dist/* dist/ 2>/dev/null || xcopy /E /I /Y frontend\\dist\\* dist\\', { stdio: 'inherit' });
} else {
    console.log('Building frontend first...');
    execSync('cd frontend && npm install && npm run build', { stdio: 'inherit' });
    execSync('cp -r frontend/dist/* dist/ 2>/dev/null || xcopy /E /I /Y frontend\\dist\\* dist\\', { stdio: 'inherit' });
}

console.log('Build process completed successfully!');
