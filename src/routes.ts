import { Application, Response, Request } from "express";
import { ZoomController } from "./zoom/zoom.controller";
import { TelexService } from "./services/telex.service";
import catchAsync from "./common/utils/catch-async";

const zoomController = new ZoomController();
const telexService = new TelexService();

const setupRoutes = (app: Application): void => {
  // Health Check route
  app.get("/health", (_req, res) => {
    res.send("Server is healthy");
  });

  app.get("/integration.json", (req: Request, res: Response) => {
    res.json(telexService.getTelexIntegrationConfig());
    return;
  });

  app.post("/webhook", catchAsync(zoomController.joinMeeting));
};

export default setupRoutes;
