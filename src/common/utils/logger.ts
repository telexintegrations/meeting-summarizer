import winston, { Logger } from "winston";
import { configService } from "../../config";

// Create a logger
const logger: Logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({ level: configService.LOG_LEVEL }),
    new winston.transports.File({
      filename: configService.LOG_FILE_PATH,
      level: configService.LOG_LEVEL,
    }),
  ],
});

export default logger;
