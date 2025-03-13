import { Agent } from "@mastra/core/agent";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import dotenv from "dotenv";

dotenv.config();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const model = google("gemini-1.5-pro");

export const meetingSummarizerAgent = new Agent({
  name: "Meeting Summarizer Agent",
  instructions: `
    You are an AI designed to summarize Zoom meetings.

    - Extract key points, decisions, and action items.
    - Provide structured summaries.
    - Highlight follow-up tasks and deadlines.`,
  model: model,
});
