import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ZoomBot } from "../zoom/zoomBot";
import { TranscriptionService } from "../transcription/transcriptionService";
import { TelexService } from "../telex/telexService";
import { Meeting } from "../db/meeting.entity";
import { AppDataSource } from "../db/db";
import { ZoomService } from "../zoom/zoomService";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const zoomBot = new ZoomBot();
const transcriptionService = new TranscriptionService();
const telexService = new TelexService();

app.post(
  "/start-meeting",
  async (req: express.Request, res: express.Response) => {
    try {
      const { inviteLink, botName } = req.body;

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
      const meetingDetails = await zoomBot.joinAndListen(inviteLink, botName);

      // Save the meeting to the database
      const meetingRepo = AppDataSource.getRepository(Meeting);
      const newMeeting = meetingRepo.create({
        meeting_id: meetingDetails.meetingId,
      });

      await meetingRepo.save(newMeeting);

      res.status(200).json({ message: "Meeting Joined Successfully" });
      return;
    } catch (error) {
      console.error("❌ Meeting Summarization Failed:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Server Running on Port ${PORT}`));
