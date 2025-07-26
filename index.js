#!/usr/bin/env node

// Railway startup script for monorepo
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Railway deployment...');

// Start the backend server
const backendPath = path.join(__dirname, 'backend', 'server.js');
const server = spawn('node', [backendPath], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🔄 Server exited with code ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
