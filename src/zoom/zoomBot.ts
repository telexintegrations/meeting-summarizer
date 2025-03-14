import puppeteer from "puppeteer";
import { ZoomService } from "./zoomService";

export class ZoomBot {
  private zoomService = new ZoomService();

  async joinAndListen(
    meetingId: string,
    passcode: string,
    botName: string
  ): Promise<{ id: string; topic: string; start_time: Date }> {
    try {
      console.log(`🔹 Fetching Join URL for Meeting: ${meetingId}`);

      // ✅ Get the correct join URL from Zoom API
      const responseData = await this.zoomService.getJoinUrl(meetingId);
      const joinUrl = responseData.join_url;

      if (!joinUrl) {
        throw new Error("Failed to retrieve the correct Zoom join link.");
      }

      // Join URL for the Zoom Web Client
      const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;

      console.log(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

      // ✅ Launch Puppeteer Headless Browser
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--use-fake-ui-for-media-stream",
        ],
      });

      const page = await browser.newPage();
      await page.goto(webClientUrl, { waitUntil: "networkidle2" });

      console.log("✅ Loaded Join Page!");

      await page.waitForSelector("#input-for-name");
      await page.waitForSelector("#input-for-pwd");

      // ✅ Enter the Name and Passcode
      await page.type("#input-for-name", botName);
      await page.type("#input-for-pwd", passcode);

      console.log("✅ Entered Name and Passcode!");

      // ✅ Click the "Join" button (using the specific class provided)
      const joinButtonSelector =
        ".zm-btn.preview-join-button.zm-btn--default.zm-btn__outline--blue";
      await page.waitForSelector(joinButtonSelector);
      await page.click(joinButtonSelector);
      console.log("✅ Bot Submitted Name and Passcode!");

      // Wait for meeting UI to be loaded
      console.log("✅ Bot Joined Meeting Successfully!");

      // ✅ Mute the microphone immediately after entering the meeting
      const muteButtonSelector =
        '.preview-video__control-button[aria-label="Mute"]';
      await page.waitForSelector(muteButtonSelector);
      await page.click(muteButtonSelector);
      console.log("✅ Bot Muted the Microphone!");

      // ✅ Stop the video by clicking the "Stop Video" button
      const stopVideoButtonSelector =
        '.preview-video__control-button[aria-label="Stop Video"]';
      await page.waitForSelector(stopVideoButtonSelector);
      await page.click(stopVideoButtonSelector);
      console.log("✅ Bot Stopped the Video!");

      // Simulate Listening for 1 Hour (or customize this time)
      await new Promise((resolve) => setTimeout(resolve, 3600000));

      // Close the browser after the meeting ends
      await browser.close();
      console.log("✅ Bot Left the Meeting!");

      return responseData;
    } catch (error) {
      console.error("❌ Failed to join and listen:", error);
      throw error;
    }
  }
}
