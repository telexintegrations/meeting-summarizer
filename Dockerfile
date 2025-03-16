FROM node:18

# Install Chrome dependencies
RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  chromium

# Set environment variables
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"

# Install dependencies
WORKDIR /app
COPY package.json ./
RUN yarn install

# Copy app files
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
