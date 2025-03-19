import axios from "axios";
import dotenv from "dotenv";
import logger from "../common/utils/logger";
import { Worker } from "worker_threads";
import path from "path";
dotenv.config();

export class ZoomService {
  private baseUrl = "https://api.zoom.us/v2";
  private clientId = process.env.ZOOM_CLIENT_ID!;
  private clientSecret = process.env.ZOOM_CLIENT_SECRET!;
  private accountId = process.env.ZOOM_ACCOUNT_ID!;
  private accessToken = "";
  private activeWorkers: Set<Worker>;

  constructor() {
    this.activeWorkers = new Set();
  }

  private async getAccessToken() {
    try {
      const response = await axios.post("https://zoom.us/oauth/token", null, {
        params: {
          grant_type: "account_credentials",
          account_id: this.accountId,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.clientId}:${this.clientSecret}`,
          ).toString("base64")}`,
        },
      });
      this.accessToken = response.data.access_token;
      logger.info("✅ Zoom API Access Token Acquired");
    } catch (error: any) {
      logger.error(
        "❌ Failed to get Zoom API token:",
        error.response?.data || error,
      );
      throw new Error("Failed to get Zoom API token");
    }
  }

  public async getJoinUrl(meetingId: string) {
    if (!this.accessToken) await this.getAccessToken();

    try {
      const response = await axios.get(
        `${this.baseUrl}/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      logger.info("✅ Correct Join URL Retrieved:", response.data.join_url);
      return response.data;
    } catch (error: any) {
      logger.error(
        "❌ Failed to fetch join URL:",
        error.response?.data || error,
      );
      return null;
    }
  }

  async getMeetingIdAndPasscode(inviteLink: string) {
    const url = new URL(inviteLink);
    const meetingId = url.pathname.split("/")[2];
    const passcode = url.searchParams.get("pwd");
    return { meetingId, passcode };
  }

  async getMeetingDetails(meetingId: string) {
    if (!this.accessToken) await this.getAccessToken();

    try {
      const response = await axios.get(
        `https://api.zoom.us/v2/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      return {
        topic: response.data.topic,
        start_time: response.data.start_time,
      };
    } catch (error) {
      logger.error("❌ Failed to fetch meeting details:", error);
      throw error;
    }
  }

  public joinMeetingWithWorker = async (workerData: {
    inviteLink: string;
  }): Promise<void> => {
    logger.info("🔹 Starting Bot Worker...", workerData);

    const workerPath = path.resolve(__dirname, "..", "zoom", "zoombot.worker");
    const worker = new Worker(workerPath);

    this.activeWorkers.add(worker);

    return new Promise<void>((resolve, reject) => {
      worker.on("message", (msg) => {
        logger.info("✅ Worker message received:", msg);
        resolve();
        this.activeWorkers.delete(worker);
      });

      worker.on("error", (err) => {
        logger.error("❌ Worker error:", err);
        reject(err);
        this.activeWorkers.delete(worker);
      });

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(`Worker stopped with exit code ${code}`);
        }
        this.activeWorkers.delete(worker);
      });

      worker.postMessage(workerData);
    });
  };
}
