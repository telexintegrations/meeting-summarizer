import "reflect-metadata";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ZoomBot } from "../zoom/zoomBot";
import { TranscriptionService } from "../transcription/transcriptionService";
import { TelexService } from "../telex/telexService";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const zoomBot = new ZoomBot();
const transcriptionService = new TranscriptionService();
const telexService = new TelexService();

app.post(
  "/start-meeting",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { meetingId, password } = req.body;

      if (!meetingId) {
        res.status(400).json({ error: "Meeting ID is required." });
        return;
      }

      console.log(`🔹 Telex Requested Meeting Join: ${meetingId}`);

      // Start the Zoom bot to join the meeting
      const meetingAudioText = await zoomBot.joinAndListen(meetingId);

      // Transcribe & summarize meeting
      const summary = await transcriptionService.transcribeAudio(
        meetingId,
        meetingAudioText,
      );

      // Send summary to Telex
      //   await telexService.sendToTelex(summary?.text);

      res
        .status(200)
        .json({ message: "Meeting summarized and sent to Telex.", summary });
    } catch (error) {
      console.error("❌ Meeting Summarization Failed:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Server Running on Port ${PORT}`));
