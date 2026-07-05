import { analyzeJournal } from "../chain/analysis.chain.js";
import { getRecentJournal } from "../tools/journalTools.js"; // wherever this lives
import { prisma } from "../config/connection.js";
import { setCache, getCache } from "../service/redis/cache.js";

const WEEKLY_GOAL = 5;

/**
 * Runs the AI analysis for a user's recent journals, saves the result to
 * weekly_analysis, and upserts extracted topics into Topic/JournalTopic.
 * This is the single place topics get written — dashboard just reads them.
 */
async function saveAnalysis(userId, entries, analysis) {
  const { title, summary, skills, gaps, recommendations, topics } = analysis;

  await prisma.weekly_analysis.create({
    data: {
      user_id: userId,
      title,
      summary,
      skills,
      gaps,
      recommendation: recommendations
    }
  });

  const journalIds = entries.map((e) => e.id);
console.log("ai.controller sees:", Object.keys(prisma));
  for (const t of topics ?? []) {
    const topic = await prisma.topics.upsert({
      where: { userId_name: { userId, name: t.name } },
      update: {
        score: t.score,
        entryCount: { increment: 1 },
        lastTouchedAt: new Date()
      },
      create: {
        userId,
        name: t.name,
        score: t.score,
        entryCount: 1,
        lastTouchedAt: new Date()
      }
    });

    for (const journalId of journalIds) {
      await prisma.journalTopics.upsert({
        where: { journalId_topicId: { journalId, topicId: topic.id } },
        update: {},
        create: { journalId, topicId: topic.id }
      });
    }
  }
}

export async function weeklyAnalysis(req, res) {
  try {
    const { id } = req.params;
    const { days } = req.query;
    const userId = Number(id);

    if (!id || !userId) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    const cacheKey = `summary-${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({ message: "cached summary", data: cached });
    }

    const entries = await getRecentJournal(userId, days);
    if (entries.length === 0) {
      return res.status(200).json({ message: "no entries to analyze", data: null });
    }

    const analysis = await analyzeJournal(entries);
    console.log("parsed topics:", analysis.topics);
    await saveAnalysis(userId, entries, analysis);

    await setCache(cacheKey, analysis, 600);

    // dashboard now reads from Topic, which this call just updated —
    // invalidate it so the dashboard reflects the new analysis immediately
    await deleteCache(`dashboard-${userId}`);

    return res.status(200).json({ message: "summary created", result: analysis });
  } catch (error) {
    console.error("weeklyAnalysis error:", error);
    return res.status(500).json({ message: "internal server error", error: error.message });
  }
}

export const analysis_db = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    if (!id || !userId) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    const cacheKey = `analysis:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({ message: "cached analysis", data: cached });
    }

    const analyses = await prisma.weekly_analysis.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" }
    });

    await setCache(cacheKey, analyses, 600);

    return res.status(200).json({ message: "successfully fetched the analysis", data: analyses });
  } catch (error) {
    console.error("analysis_db error:", error);
    return res.status(500).json({ message: "internal server error", error: error.message });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    if (!id || !userId) {
      return res.status(401).json({ message: "unauthorized user" });
    }

    const cacheKey = `dashboard-${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.status(200).json({ message: "cached dashboard", result: cached });
    }

    const streak = await calculateStreak(userId);

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const weeklyCount = await prisma.journals.count({
      where: {
        user_id: userId,
        created_at: { gte: startOfWeek }
      }
    });

    const weeklyProgress = Math.min((weeklyCount / WEEKLY_GOAL) * 100, 100);

    // all topics, not just top 3 — dashboard needs the full list to compute
    // drift (stale topics) and follow-through, not just the leaderboard
    const allTopics = await prisma.topics.findMany({
      where: { userId },
      orderBy: { score: "desc" }
    });

    const now = Date.now();
    const daysSince = (d) => (d ? Math.floor((now - new Date(d).getTime()) / 86400000) : null);

    const topicsWithDrift = allTopics.map((t) => {
      const days = daysSince(t.lastTouchedAt);
      return {
        name: t.name,
        score: t.score,
        entryCount: t.entryCount,
        lastTouchedAt: t.lastTouchedAt,
        daysSinceLastTouch: days,
        status: days === null ? "unknown" : days >= 10 ? "stale" : days >= 5 ? "drifting" : "active"
      };
    });

    const drifting = topicsWithDrift.filter((t) => t.status === "drifting" || t.status === "stale");
    const revisited = topicsWithDrift.filter((t) => t.status === "active" && t.entryCount > 1);

    const followThroughRate =
      allTopics.length > 0
        ? Math.round((allTopics.filter((t) => t.entryCount > 1).length / allTopics.length) * 100)
        : 0;

    const focusTopic = allTopics.slice(0, 3).map((t) => t.name);
    const topicProgress = Object.fromEntries(allTopics.slice(0, 3).map((t) => [t.name, t.score]));

    // last analysis's recommendations, so the dashboard can show
    // "did you act on what AI Recap suggested last time"
    const lastAnalysis = await prisma.weekly_analysis.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" }
    });

    const result = {
      streak,
      weeklyCount,
      weeklyProgress,
      focusTopic,
      topicProgress,
      followThroughRate,
      topicsStarted: allTopics.length,
      drifting,
      revisited,
      lastRecommendations: lastAnalysis?.recommendation ?? []
    };

    await setCache(cacheKey, result, 600);

    return res.status(200).json({ message: "successfully fetched dashboard", result });
  } catch (error) {
    console.error("getDashboardMetrics error:", error);
    return res.status(500).json({ message: "internal server error", error: error.message });
  }
};

export const calculateStreak = async (userId) => {
  const logs = await prisma.journals.findMany({
    where: { user_id: userId },
    select: { created_at: true },
    orderBy: { created_at: "desc" }
  });

  if (logs.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].created_at);
    logDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // posted today
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffInDays === 1) {
      // hasn't posted today yet, but posted yesterday — streak still alive,
      // move the comparison date back and count yesterday's entry
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // gap of 2+ days — streak broken
      break;
    }
  }

  return streak;
};