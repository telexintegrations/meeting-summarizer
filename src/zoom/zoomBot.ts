// import puppeteer from "puppeteer";
// import { ZoomService } from "./zoomService";

// export class ZoomBot {
//   private zoomService = new ZoomService();

//   async joinAndListen(
//     meetingId: string
//   ): Promise<{ id: string; topic: string; start_time: Date }> {
//     try {
//       console.log(`🔹 Fetching Join URL for Meeting: ${meetingId}`);

//       // ✅ Get the correct join URL from Zoom API
//       const responseData = await this.zoomService.getJoinUrl(meetingId);
//       const joinUrl = responseData.join_url;

//       if (!joinUrl)
//         throw new Error("Failed to retrieve the correct Zoom join link.");

//       console.log(`🔹 Bot Joining via URL: ${joinUrl}`);

//       // ✅ Launch Puppeteer Headless Browser
//       const browser = await puppeteer.launch({
//         headless: false,
//         args: [],
//       });

//       const page = await browser.newPage();
//       await page.goto(joinUrl, { waitUntil: "networkidle2" });

//       console.log("✅ Bot Joined Meeting Successfully!");

//       // Simulate Listening for 1 Minute
//       await new Promise((resolve) => setTimeout(resolve, 60000));

//       // Close the browser after the meeting ends
//       await browser.close();
//       console.log("✅ Bot Left the Meeting!");

//       return responseData;
//     } catch (error) {
//       console.error("❌ Failed to join and listen:", error);
//       throw error;
//     }
//   }
// }

import puppeteer from "puppeteer";
import { ZoomService } from "./zoomService";

export class ZoomBot {
  private zoomService = new ZoomService();

  async joinAndListen(
    meetingId: string
  ): Promise<{ id: string; topic: string; start_time: Date }> {
    try {
      console.log(`🔹 Fetching Join URL for Meeting: ${meetingId}`);

      // ✅ Get the correct join URL from Zoom API
      const responseData = await this.zoomService.getJoinUrl(meetingId);
      const joinUrl = responseData.join_url;

      if (!joinUrl)
        throw new Error("Failed to retrieve the correct Zoom join link.");

      // Join URL for the Zoom Web Client
      const webClientUrl = `https://zoom.us/wc/${meetingId}/join`;

      console.log(`🔹 Bot Joining via Web Client URL: ${webClientUrl}`);

      // ✅ Launch Puppeteer Headless Browser
      const browser = await puppeteer.launch({
        headless: false, // Change to true if you want headless mode
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.goto(webClientUrl, { waitUntil: "networkidle2" });

      console.log("✅ Bot Joined Meeting Successfully!");

      // You may want to simulate additional steps, such as clicking a "Join with Video" button, entering credentials, or accepting permissions.

      // Simulate Listening for 1 Minute (or customize this time)
      await new Promise((resolve) => setTimeout(resolve, 360000));

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
