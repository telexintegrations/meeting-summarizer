import { parentPort } from "worker_threads";
import puppeteer from "puppeteer";
import logger from "../common/utils/logger";
import { ZoomService } from "../services/zoom.service";

const botName = "Tom Meeting Summarizer";
const zoomService = new ZoomService();

parentPort?.on("message", async (workerData: { inviteLink: string }) => {
  try {
    const { inviteLink } = workerData;

    if (!inviteLink) {
      throw new Error("Invalid Zoom invite link received.");
    }

    logger.info(`🔹 Fetching Join URL from Invite Link: ${inviteLink}`);

    const { meetingId, passcode } = await zoomService.getMeetingIdAndPasscode(
      inviteLink,
    );

    if (!meetingId) {
      throw new Error("Failed to extract the meeting ID from the invite link.");
    }

    const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;
    logger.info(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

    // Launch Puppeteer to interact with Zoom
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
    logger.info("✅ Loaded Join Page!");

    await page.waitForSelector("#input-for-name");
    await page.waitForSelector("#input-for-pwd");

    await page.type("#input-for-name", botName);

    if (passcode) {
      await page.type("#input-for-pwd", passcode);
    }

    logger.info("✅ Entered Name and Passcode!");

    const joinButtonSelector = ".zm-btn.preview-join-button";
    await page.waitForSelector(joinButtonSelector);
    await page.click(joinButtonSelector);
    logger.info("✅ Bot Submitted Name and Passcode!");

    parentPort?.postMessage({
      success: true,
      message: "✅ Bot Joined the Meeting",
      meetingId: meetingId,
    });

    await waitForMeetingToEnd(page);

    await browser.close();
    logger.info("✅ Bot Left the Meeting!");
  } catch (error: any) {
    logger.error("❌ Failed to join and listen:", error);
    parentPort?.postMessage({ success: false, error: error.message });
  }
});

async function waitForMeetingToEnd(page: any) {
  const meetingEndedSelector = ".zoom-meeting-ended";

  while (true) {
    try {
      await page.waitForSelector(meetingEndedSelector, { timeout: 60000 });

      logger.info("❌ Meeting has ended. Bot is leaving the meeting.");
      break;
    } catch (e) {
      logger.info("⏳ Meeting still active... Bot is staying in the meeting.");
    }
  }
}
