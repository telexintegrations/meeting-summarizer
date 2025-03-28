# Use Node.js 20 as the base image
FROM node:20-slim

# Set the working directory for Node.js app
WORKDIR /usr/src/app

# Copy package.json and yarn.lock (if present)
COPY package*.json yarn.lock ./ 

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application using yarn
CMD ["yarn", "start"]