import puppeteer from "puppeteer";
import { ZoomService } from "./zoomService";

export class ZoomBot {
  private zoomService = new ZoomService();

  async joinAndListen(
    inviteLink: string,
    botName: string
  ): Promise<{ meetingId: string }> {
    try {
      console.log(`🔹 Fetching Join URL from Invite Link: ${inviteLink}`);

      // Extract the meetingId and passcode from the invite link
      const { meetingId, passcode } =
        await this.zoomService.getMeetingIdAndPasscode(inviteLink);

      if (!meetingId) {
        throw new Error(
          "Failed to extract the meeting ID from the invite link."
        );
      }

      console.log(`🔹 Meeting ID: ${meetingId}, Passcode: ${passcode}`);

      // Join URL for the Zoom Web Client
      const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;

      console.log(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

      // ✅ Launch Puppeteer Headless Browser
      const browser = await puppeteer.launch({
        headless: false,
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

      // ✅ Enter the Name and Passcode (if provided)
      await page.type("#input-for-name", botName);
      if (passcode) {
        await page.type("#input-for-pwd", passcode);
      }

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

      return {
        meetingId,
      };
    } catch (error) {
      console.error("❌ Failed to join and listen:", error);
      throw error;
    }
  }
}
