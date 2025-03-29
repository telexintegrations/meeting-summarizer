import express from "express";
import { ZoomService } from "../services/zoom.service";
import logger from "../common/utils/logger";
import axios from "axios";

export class ZoomController {
  private zoomService: ZoomService;

  constructor() {
    this.zoomService = new ZoomService();
  }

  public joinMeeting = async (req: express.Request, res: express.Response) => {
    const { message, channel_id, thread_id, org_id } = req.body;

    const regex = /href="([^"]+)"/;
    const inviteLink = message.match(regex)[1];

    if (!inviteLink) {
      return res
        .status(400)
        .json({ error: "Invalid or missing Zoom invite link." });
    }

    logger.info(
      `🔹 Meeting Summarizer Bot Requested to Join Meeting: ${inviteLink}`
    );

    try {
      return res.status(200).json({ message:"Got it! I'm joining the Zoom meeting. I'll transcribe it and send a summary here when it's done."});
    } catch (error: any) {
      logger.error("❌ Error joining meeting:", error);
      return res.status(500).json({ error: error.message });
    }
  };
}
