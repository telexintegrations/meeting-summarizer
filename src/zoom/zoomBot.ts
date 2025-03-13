import puppeteer from "puppeteer";
import { ZoomService } from "./zoomService";

export class ZoomBot {
  private zoomService = new ZoomService();

  async joinAndListen(meetingId: string): Promise<string> {
    try {
      console.log(`🔹 Fetching Join URL for Meeting: ${meetingId}`);

      // ✅ Get the correct join URL from Zoom API
      const joinUrl = await this.zoomService.getJoinUrl(meetingId);
      if (!joinUrl)
        throw new Error("Failed to retrieve the correct Zoom join link.");

      console.log(`🔹 Bot Joining via URL: ${joinUrl}`);

      // ✅ Launch Puppeteer Headless Browser
      const browser = await puppeteer.launch({
        executablePath:
          "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", // Replace this with your actual Chrome path
        headless: false, // Change to true if you don’t want to see the browser
        args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for WSL
      });

      const page = await browser.newPage();
      await page.goto(joinUrl, { waitUntil: "networkidle2" });

      console.log("✅ Bot Joined Meeting Successfully!");

      // Simulate Listening for 1 Minute
      await new Promise((resolve) => setTimeout(resolve, 60000));

      // Close the browser after the meeting ends
      await browser.close();
      console.log("✅ Bot Left the Meeting!");

      // Simulated transcription text
      const simulatedTranscript =
        "Meeting started with discussions about quarterly goals...";
      console.log("🔹 Simulated Meeting Transcript:", simulatedTranscript);

      return simulatedTranscript;
    } catch (error) {
      console.error("❌ Failed to join and listen:", error);
      throw error;
    }
  }
}
