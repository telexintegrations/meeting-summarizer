import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import setupRoutes from "./routes";
import { globalRequestHandler } from "./common/middlewares/request.handler";
import { globalErrorHandler } from "./common/middlewares/error.handler";

const app: Application = express();

// Apply middlewares globally
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());

// Global Request Handler
app.use(globalRequestHandler);

// Set up the routes
setupRoutes(app);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
