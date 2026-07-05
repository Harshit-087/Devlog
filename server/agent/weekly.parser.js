import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const weeklySchema = z.object({
  title: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
  topics: z.array(z.object({
    name: z.string(),
    score: z.number()
  }))
});

export const weeklyParser = StructuredOutputParser.fromZodSchema(weeklySchema);
