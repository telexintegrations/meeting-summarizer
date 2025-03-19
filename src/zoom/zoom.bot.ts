import puppeteer from "puppeteer";
import { ZoomService } from "../services/zoom.service";
import dotenv from "dotenv";

dotenv.config();

export class ZoomBot {
  private zoomService: ZoomService;
  private botName = "Telex AI Meeting Summarizer";

  async joinAndListen(
    inviteLink: string,
    botName: string
  ): Promise<{ meetingId: string }> {
    try {
      console.log(`🔹 Fetching Join URL from Invite Link: ${inviteLink}`);

      const { meetingId, passcode } =
        await this.zoomService.getMeetingIdAndPasscode(inviteLink);

      if (!meetingId) {
        throw new Error(
          "Failed to extract the meeting ID from the invite link."
        );
      }

      const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;

      console.log(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

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

      await page.type("#input-for-name", this.botName);
      if (passcode) {
        await page.type("#input-for-pwd", passcode);
      }

      console.log("✅ Entered Name and Passcode!");

      const joinButtonSelector =
        ".zm-btn.preview-join-button.zm-btn--default.zm-btn__outline--blue";
      await page.waitForSelector(joinButtonSelector);
      await page.click(joinButtonSelector);
      console.log("✅ Bot Submitted Name and Passcode!");

      console.log("✅ Bot Joined Meeting Successfully!");

      const muteButtonSelector =
        '.preview-video__control-button[aria-label="Mute"]';
      await page.waitForSelector(muteButtonSelector);
      await page.click(muteButtonSelector);
      console.log("✅ Bot Muted the Microphone!");

      const stopVideoButtonSelector =
        '.preview-video__control-button[aria-label="Stop Video"]';
      await page.waitForSelector(stopVideoButtonSelector);
      await page.click(stopVideoButtonSelector);
      console.log("✅ Bot Stopped the Video!");

      await new Promise((resolve) => setTimeout(resolve, 72000000));

      await browser.close();
      console.log("✅ Bot Left the Meeting!");

      return { meetingId };
    } catch (error) {
      console.error("❌ Failed to join and listen:", error);
      throw error;
    }
  }
}
