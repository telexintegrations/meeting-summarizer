import { AppDataSource } from "../db/db";
import { Transcript } from "../db/transcript.entity";
import { Meeting } from "../db/meeting.entity";

export class TranscriptionService {
  async transcribeAudio(meetingId: string, audioText: string) {
    try {
      const meetingRepo = AppDataSource.getRepository(Meeting);
      const transcriptRepo = AppDataSource.getRepository(Transcript);

      const meeting = await meetingRepo.findOneBy({ meeting_id: meetingId });

      if (!meeting) {
        console.error("❌ Meeting Not Found");
        return;
      }

      const transcript = new Transcript();
      transcript.meeting = meeting;
      transcript.transcript = audioText;
      await transcriptRepo.save(transcript);
      console.log("✅ Transcription Stored Successfully");

      const meetingSummarizerAgent = mastra.getAgent("meetingSummarizerAgent");
      const summary = await meetingSummarizerAgent.generate([
        {
          role: "user",
          content: audioText,
        },
      ]);

      console.log("✅ AI-Generated Summary:", summary);
      return summary;
    } catch (error) {
      console.error("❌ Transcription or Summarization Failed:", error);
    }
  }
}
