import express from "express";
import { ZoomService } from "../services/zoom.service";
import logger from "../common/utils/logger";

export class ZoomController {
  private zoomService: ZoomService;

  constructor() {
    this.zoomService = new ZoomService();
  }

  public joinMeeting = async (req: express.Request, res: express.Response) => {
    const { inviteLink } = req.body;

    if (!inviteLink) {
      return res
        .status(400)
        .json({ error: "Invalid or missing Zoom invite link." });
    }

    logger.info(
      `🔹 Meeting Summarizer Bot Requested to Join Meeting: ${inviteLink}`
    );

    try {
      await this.zoomService.joinMeetingWithWorker({ inviteLink });
      return res
        .status(200)
        .json({ success: true, message: "✅ Bot Joined the Meeting" });
    } catch (error: any) {
      logger.error("❌ Error joining meeting:", error);
      return res.status(500).json({ error: error.message });
    }
  };
}
