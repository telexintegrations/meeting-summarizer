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

  app.post("/join-meeting", catchAsync(zoomController.joinMeeting));
  app.get("/integration.json", (req: Request, res: Response) => {
    res.json(telexService.getTelexIntegrationConfig());
    return;
  });

  app.post(
    "/webhook",
    catchAsync(async (req: Request, res: Response) => {
      console.log(req.body);
      res.status(200).json({});
    }),
  );
};

export default setupRoutes;
