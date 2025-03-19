import { spawn } from "child_process";
import logger from "../common/utils/logger";
import { Readable } from "stream";

export class ZoomTranscriptionService {
  async captureAudioWithFFmpeg(): Promise<Readable> {
    try {
      logger.info("🔹 Capturing system audio using FFmpeg...");

      const ffmpegProcess = spawn("ffmpeg", [
        "-f",
        "avfoundation",
        "-i",
        "default",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        "-t",
        "7200",
        "pipe:1",
      ]);

      // FFmpeg stdout is the audio stream we want to process
      const audioStream = ffmpegProcess.stdout as Readable;
      return audioStream;
    } catch (error) {
      console.error("❌ Failed to capture system audio:", error);
      throw error;
    }
  }
}
