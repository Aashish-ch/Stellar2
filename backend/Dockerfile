# Backend Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY backend/src ./src

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Start server
CMD [ "node", "src/index.js" ]
