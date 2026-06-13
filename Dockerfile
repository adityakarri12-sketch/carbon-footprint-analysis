# Dockerfile for CarbonWise

# Use the official Node.js 20 image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . .

# Build the Next.js application.
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Run the Next.js application.
CMD ["npm", "start"]
