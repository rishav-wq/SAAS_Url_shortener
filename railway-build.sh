#!/bin/bash
echo "🔧 Building SaaS URL Shortener..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm ci
cd ..

echo "✅ Build completed successfully!"
