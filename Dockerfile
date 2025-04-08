# 1. Choose base image (Node.js version - use a specific LTS like 18 or 20)
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package files first (leverage layer caching)
# Copy both package.json AND package-lock.json (or yarn.lock)
COPY package*.json ./

# 4. Install dependencies cleanly using lockfile (faster, more reliable)
# Use --only=production to skip devDependencies for a smaller image
RUN npm ci --only=production

# 5. Copy the rest of the application code from your local machine to the container's working directory
COPY . .

# 6. Expose the port the app runs on *inside* the container (must match PORT env var)
EXPOSE 3000

# 7. Define the command to run the application when the container starts
CMD [ "node", "server.js" ]
