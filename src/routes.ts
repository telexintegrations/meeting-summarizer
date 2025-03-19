import { Application } from "express";
import { ZoomController } from "./zoom/zoom.controller";

const zoomController = new ZoomController();

const setupRoutes = (app: Application): void => {
  // Health Check route
  app.get("/health", (_req, res) => {
    res.send("Server is healthy");
  });

  app.use("/join-meeting", zoomController.joinMeeting);
};

export default setupRoutes;
