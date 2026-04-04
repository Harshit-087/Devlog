import { tool } from "@langchain/core/tools";
import { getLastWeekJournal } from "./journalTool.js";

export const journalTool = tool(
  async ({ userId }) => {
    const data = await getLastWeekJournal(userId);
    return JSON.stringify(data);
  },
  {
    name: "get_last_week_journal",
    description: "Fetch last 7 days journal entries for analysis"
  }
);