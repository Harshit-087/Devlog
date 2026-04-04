import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const weeklySchema = z.object({
  title: z.string(),
  summary: z.string(),
  skills: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendation: z.array(z.string()),
});


const dashboardSchema = z.object({
  focus:z.array(z.string()),
  progress:z.string()
})

export const dashboardParser = StructuredOutputParser.fromZodSchema(dashboardSchema)
export const weeklyParser = StructuredOutputParser.fromZodSchema(weeklySchema);