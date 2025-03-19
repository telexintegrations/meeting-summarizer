import dotenv from "dotenv";

dotenv.config();

export const configService = {
  // General settings
  NODE_ENV: (process.env.NODE_ENV as string) || "development",

  // Server settings
  PORT: (process.env.PORT as unknown as number) || 3000,

  // Other settings
  APP_URL: process.env.APP_URL || "http://localhost",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || "logs/app.log",

  // Database settings
  MONGODB_URI:
    (process.env.MONGODB_URI as string) ||
    "mongodb://localhost:27017/ai-meeting-summarizer",
};
