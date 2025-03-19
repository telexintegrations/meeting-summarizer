import { Application } from "express";
import { ZoomController } from "./zoom/zoom.controller";
import catchAsync from "./common/utils/catch-async";
const zoomController = new ZoomController();

const setupRoutes = (app: Application): void => {
  // Health Check route
  app.get("/health", (_req, res) => {
    res.send("Server is healthy");
  });

  app.post("/join-meeting", catchAsync(zoomController.joinMeeting));
};

export default setupRoutes;
