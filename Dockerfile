# 📌 Stage 1: Base dependencies (Node.js + FFmpeg + Whisper)
FROM node:20-slim AS base

# Set environment variables to disable Puppeteer sandbox (reduces memory usage)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    ffmpeg \
    pulseaudio \
    xvfb \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# 📌 Stage 2: Whisper AI (Transcription Engine)
FROM base AS whisper

# Set up Python virtual environment for Whisper
RUN python3 -m venv /opt/whisper-env
RUN /opt/whisper-env/bin/pip install --upgrade pip \
    && /opt/whisper-env/bin/pip install openai-whisper

# Ensure Whisper is available in the system path
ENV PATH="/opt/whisper-env/bin:$PATH"

# 📌 Stage 3: Application Build (Zoom Bot + API)
FROM base AS app

WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the entire app
COPY . .

# Build the app
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
