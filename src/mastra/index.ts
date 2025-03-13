import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";

import { meetingSummarizerAgent } from "./agents";

export const mastra = new Mastra({
  agents: { meetingSummarizerAgent },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
