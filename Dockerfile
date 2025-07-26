# Multi-stage build for Railway deployment
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install all dependencies (including devDependencies for building)
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build frontend
RUN cd frontend && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/

# Install only production dependencies
RUN cd backend && npm ci --only=production

# Copy built application
COPY --from=builder /app/backend/ ./backend/
COPY --from=builder /app/frontend/dist/ ./frontend/dist/

# Create necessary directories
RUN mkdir -p uploads/payment-proofs invoices

# Expose port (Railway uses PORT environment variable)
EXPOSE $PORT

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "backend/server.js"]
