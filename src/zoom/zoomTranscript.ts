import axios from "axios";

// Zoom API URL
const ZOOM_API_URL = "https://api.zoom.us/v2/meetings";

// Function to fetch meeting recordings (including transcript) from Zoom API
export async function getMeetingTranscript(
  meetingId: string,
  accessToken: string
) {
  try {
    // Make an API request to get meeting recordings
    const response = await axios.get(
      `${ZOOM_API_URL}/${meetingId}/recordings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Find the transcript file from the recordings
    const transcriptFile = response.data.recording_files.find(
      (file: any) => file.file_type === "TRANSCRIPT"
    );

    if (transcriptFile) {
      // Download the transcript
      const transcriptUrl = transcriptFile.download_url;
      const transcriptResponse = await axios.get(transcriptUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Meeting Transcript:", transcriptResponse.data);
      return transcriptResponse.data;
    } else {
      throw new Error("No transcript available for this meeting.");
    }
  } catch (error) {
    console.error("❌ Failed to retrieve transcript:", error);
    throw error;
  }
}
