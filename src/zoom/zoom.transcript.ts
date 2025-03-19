import axios from "axios";

const ZOOM_API_URL = "https://api.zoom.us/v2/meetings";

export async function getMeetingTranscript(
  meetingId: string,
  accessToken: string
) {
  try {
    const response = await axios.get(
      `${ZOOM_API_URL}/${meetingId}/recordings`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const transcriptFile = response.data.recording_files.find(
      (file: any) => file.file_type === "VTT"
    );

    if (transcriptFile) {
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
