#!/bin/bash

echo "🚀 Starting Railway Deployment..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🔧 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend  
npm install
cd ..

echo "✅ Build completed successfully!"
echo "🚀 Starting server..."

# Start the backend server
cd backend && npm start
