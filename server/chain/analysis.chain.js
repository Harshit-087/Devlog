import { weeklyParser } from "../agent/weekly.parser.js";
import { llm } from "../config/ai.js";

export async function analyzeJournal(entries) {
  const formatInstructions = weeklyParser.getFormatInstructions();
  const prompt = `
Analyze these developer journal entries.
title should be a keyword from the input entries title.

Find:
1. title suitable for the processing
2. Weekly summary
3. Skills learned
4. Missing learning gaps
5. Recommended next topics
6. topics: the distinct subject areas mentioned (e.g. "Auth", "Caching", "Prisma relations"),
   each scored 1-10 based on how deeply it was explored in these entries.
   Return as an array sorted by score descending, highest first.

No markdown.
No explanation.
Return ONLY valid JSON:
{
  "title": "",
  "summary": "",
  "skills": [],
  "gaps": [],
  "recommendations": [],
  "topics": [{ "name": "", "score": 0 }]
}
Entries:
${JSON.stringify(entries)}

${formatInstructions}
`;

  const response = await llm.invoke(prompt);
  const cleanText = response.content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsed = await weeklyParser.parse(cleanText);
    return parsed;
  } catch (err) {
    console.error("analyzeJournal parse failed:", err.message, cleanText);
    throw new Error("AI analysis returned malformed output");
  }
}