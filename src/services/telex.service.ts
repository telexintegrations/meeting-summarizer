import axios from "axios";
import { configService } from "../config";

export class TelexService {
  async sendToTelex(summary: string | undefined) {
    try {
      await axios.post(process.env.TELEX_API_URL!, {
        channel: "meeting-transcripts",
        message: `**AI-Generated Summary:**\n${summary}`,
      });

      console.log("✅ AI Summary Sent to Telex Successfully");
    } catch (error) {
      console.error("❌ Failed to Send Summary to Telex:", error);
    }
  }

  getTelexIntegrationConfig() {
    return {
      data: {
        date: {
          created_at: "2025-03-20",
          updated_at: "2025-03-20",
        },
        descriptions: {
          app_name: "Meeting Summarizer",
          app_description:
            "An AI-powered agent that joins meetings, transcribes in real-time, and summarizes discussions.",
          app_logo:
            "https://st1.zoom.us/homepage/publish/static-image/zoom-logo.svg",
          app_url: `${configService.APP_URL}`,
          background_color: "#fff",
        },
        is_active: true,
        integration_type: "modifier",
        integration_category: "Communication & Collaboration",
        key_features: [
          "Real-Time Meeting Transcription",
          "AI-Powered Summarization",
        ],
        author: "Telex AI Meeting Bot",
        settings: [
          {
            label: "Client_Secret",
            type: "text",
            required: false,
            default: "",
          },
          {
            label: "Client_ID",
            type: "text",
            required: false,
            default: "",
          },
        ],
        target_url: `${configService.APP_URL}/webhook`,
        tick_url: `${configService.APP_URL}`,
      },
    };
  }
}
