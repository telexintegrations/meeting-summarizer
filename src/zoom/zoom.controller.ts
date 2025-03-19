import express from "express";
import { ZoomBot } from "./zoom.bot";
import catchAsync from "../common/utils/catch-async";

export class ZoomController {
  private zoomBot: ZoomBot;

  constructor() {
    this.zoomBot = new ZoomBot();
  }

  public joinMeeting = catchAsync(
    async (req: express.Request, res: express.Response) => {
      const { inviteLink } = req.body;

      if (!inviteLink) {
        res
          .status(400)
          .json({ error: "Zoom Meeting invite link is required." });
        return;
      }

      console.log(
        `🔹 Meeting Summarizer Bot Requested to Join Meeting: ${inviteLink}`
      );

      // Start the Zoom bot to join the meeting
      const joiningMeeting = await this.zoomBot.joinAndListen(inviteLink);

      if (!joiningMeeting) {
        return res.status(400).json({ error: "Failed to join meeting" });
      }

      return res.status(200).json({
        message: "Meeting Joined Successfully",
        meetingId: joiningMeeting.meetingId,
      });
    }
  );
}
