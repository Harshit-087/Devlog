import { getRecentJournal } from "../tools/journalTools.js";
import { analyzeJournal ,dashboard_journalAnalysis } from "../chain/analysis.chain.js";


export async function runWeeklyAnalysis(userId,days) {
  const journals = await getRecentJournal(userId,days);
  console.log("service",journals)
  return await analyzeJournal(journals);
}

export async function weeklyAnalysis_dashboard(userId,days){
      const journals = await getRecentJournal(userId,days);
      return await dashboard_journalAnalysis(journals);
}