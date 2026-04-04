import { createReactAgent } from "langchain/agents";
import { llm } from "../../config/ai.js";
import { journalTool } from "../tools/langchaintool.js"

const tools = [journalTool];

export const agent = createReactAgent({
  llm,
  tools
});