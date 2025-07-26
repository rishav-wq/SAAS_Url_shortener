# Use Node.js 18 alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production

# Build frontend
COPY frontend/ ./frontend/
RUN cd frontend && npm ci && npm run build

# Copy backend files
COPY backend/ ./backend/

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["npm", "start"]
