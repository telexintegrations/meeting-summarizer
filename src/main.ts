import mongoose from "mongoose";
import app from "./app";
import logger from "./common/utils/logger";
import { configService } from "./config";

// MongoDB connection
mongoose
  .connect(configService.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB: ", error);
  });

// Start server
app.listen(configService.PORT, () => {
  logger.info(
    `Application is running on ${configService.APP_URL}:${configService.PORT}`
  );
});
