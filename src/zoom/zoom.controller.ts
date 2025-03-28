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
      const baseUrl: any = "https://telex.im/dashboard/channels/"
      const telexResponse = await axios.post(
        `${baseUrl}/${channel_id}/messages`,
        {
          thread_id: thread_id,
          org_id: org_id,
          text: "✅ Bot Joined the Meeting",
        }
      );
      if (telexResponse.status !== 200) {
        logger.error(
          `Telex API error: ${telexResponse.status} - ${telexResponse.data}`
        );
        return res.status(500).json({ error: "Telex API error" });
      }
      return res.status(200).json({});
    } catch (error: any) {
      logger.error("❌ Error joining meeting:", error);
      return res.status(500).json({ error: error.message });
    }
  };
}
