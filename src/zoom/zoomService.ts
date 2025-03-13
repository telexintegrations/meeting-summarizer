import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class ZoomService {
  private baseUrl = "https://api.zoom.us/v2";
  private clientId = process.env.ZOOM_CLIENT_ID!;
  private clientSecret = process.env.ZOOM_CLIENT_SECRET!;
  private accountId = process.env.ZOOM_ACCOUNT_ID!;
  private accessToken = "";

  // ✅ Fetch OAuth Token
  private async getAccessToken() {
    try {
      const response = await axios.post("https://zoom.us/oauth/token", null, {
        params: {
          grant_type: "account_credentials",
          account_id: this.accountId,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        },
      });
      this.accessToken = response.data.access_token;
      console.log("✅ Zoom API Access Token Acquired");
    } catch (error: any) {
      console.error(
        "❌ Failed to get Zoom API token:",
        error.response?.data || error,
      );
      throw new Error("Failed to get Zoom API token");
    }
  }

  // ✅ Fetch Correct Join URL from Zoom API
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

      console.log("✅ Correct Join URL Retrieved:", response.data.join_url);
      return response.data.join_url; // Use this URL to join the meeting
    } catch (error: any) {
      console.error(
        "❌ Failed to fetch join URL:",
        error.response?.data || error,
      );
      return null;
    }
  }
}
