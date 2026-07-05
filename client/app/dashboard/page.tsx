"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Flame, RefreshCcw, Compass, CheckCircle2, Loader2, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { initialState } from "@/store/router";
import { aiQuery } from "../api/aiQuery";

type TopicDrift = {
  name: string;
  score: number;
  entryCount: number;
  lastTouchedAt: string | null;
  daysSinceLastTouch: number | null;
  status: "active" | "drifting" | "stale" | "unknown";
};

type DashboardData = {
  streak: number;
  weeklyCount: number;
  weeklyProgress: number;
  focusTopic: string[];
  topicProgress: Record<string, number>;
  followThroughRate: number;
  topicsStarted: number;
  drifting: TopicDrift[];
  revisited: TopicDrift[];
  lastRecommendations: string[];
};

export default function Dashboard() {
  const { id } = useSelector((state: { user: initialState }) => state.user);

  const { data: dashboard, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["dashboard-analysis", id],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey as [string, string | undefined];
      if (!userId) throw new Error("No user ID found");
      const response = await aiQuery.fetchDashboardAnalysis(userId);
    
      return response.data.result;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10
  });

  const heroText = useMemo(() => {
    if (!dashboard) return "";
    const staleNames = dashboard.drifting.map((t) => t.name);
    if (staleNames.length === 0) {
      return dashboard.topicsStarted > 0
        ? "You're keeping up with everything you've started this week. Nice."
        : "Log a few entries this week to start seeing your focus areas here.";
    }
    const listed = staleNames.slice(0, 2).join(" or ");
    return `You've started ${dashboard.topicsStarted} topic${dashboard.topicsStarted === 1 ? "" : "s"} but haven't revisited ${listed} in a while.`;
  }, [dashboard]);

  const isDrifting = (dashboard?.drifting.length ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="text-red-400 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
        Failed to load dashboard metrics.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      {/* 1 — Hero narrative strip */}
      <Card className="bg-gradient-to-br from-indigo-950/60 to-slate-900/60 border border-slate-700/50 rounded-2xl shadow-lg">
        <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-slate-200 text-base leading-relaxed">{heroText}</p>
          {isDrifting && (
            <span className="text-xs font-bold text-amber-950 bg-amber-400 px-3 py-1.5 rounded-full whitespace-nowrap">
              DRIFTING
            </span>
          )}
        </CardContent>
      </Card>

      {/* 2 — Stat row: streak / follow-through / topics started / weekly entries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Flame className="w-6 h-6 text-amber-400" />}
          iconBg="from-amber-500/20 to-orange-500/20"
          label="Streak"
          value={dashboard.streak}
          hint="Keep it up 🔥"
        />
        <StatCard
          icon={<RefreshCcw className="w-6 h-6 text-indigo-400" />}
          iconBg="from-indigo-500/20 to-violet-500/20"
          label="Follow-through rate"
          value={`${dashboard.followThroughRate}%`}
          hint="topics touched more than once"
        />
        <StatCard
          icon={<Compass className="w-6 h-6 text-purple-400" />}
          iconBg="from-purple-500/20 to-pink-500/20"
          label="Topics started"
          value={dashboard.topicsStarted}
          hint="tracked so far"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          iconBg="from-emerald-500/20 to-teal-500/20"
          label="Weekly entries"
          value={dashboard.weeklyCount}
        />
      </div>

      {/* 3 — Drifting topics vs recently revisited */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <SectionTitle icon={<AlertTriangle className="w-5 h-5 text-amber-400" />} title="Topics You're Drifting From" />
            {dashboard.drifting.length > 0 ? (
              <div className="space-y-2">
                {dashboard.drifting.map((t) => (
                  <div
                    key={t.name}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl bg-slate-800/50 border-l-4 ${
                      t.status === "stale" ? "border-red-500" : "border-amber-400"
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-200">{t.name}</span>
                    <span className="text-xs text-slate-400">
                      last touched {t.daysSinceLastTouch}d ago{t.status === "stale" ? " — stale" : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">Nothing drifting right now.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <SectionTitle icon={<TrendingUp className="w-5 h-5 text-emerald-400" />} title="Recently Revisited" />
            {dashboard.revisited.length > 0 ? (
              <div className="space-y-2">
                {dashboard.revisited.map((t) => (
                  <div
                    key={t.name}
                    className="flex justify-between items-center px-4 py-3 rounded-xl bg-slate-800/50 border-l-4 border-emerald-400"
                  >
                    <span className="text-sm font-medium text-slate-200">{t.name}</span>
                    <span className="text-xs text-slate-400">{t.entryCount} entries this period</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">No repeat topics yet — good follow-through shows up here.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4 — Follow-through by topic (top 3, with dialog for the rest could be re-added here if needed) */}
      <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Follow-through by Topic</h3>
          {Object.keys(dashboard.topicProgress).length > 0 ? (
            Object.entries(dashboard.topicProgress).map(([name, score]) => (
              <div key={name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{name}</span>
                  <span className="text-slate-400">{score}%</span>
                </div>
                <Progress value={score} className="h-2 bg-slate-800" />
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm italic">No topics logged yet.</p>
          )}
        </CardContent>
      </Card>

      {/* 5 — Recent wins + this week's ask (ties back to last AI Recap) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Recent Wins 🏆</h3>
            {dashboard.revisited.slice(0, 3).map((t) => (
              <WinItem key={t.name} label={t.name} />
            ))}
            {dashboard.revisited.length === 0 && (
              <p className="text-slate-500 text-sm italic">Nothing to show yet — log a few more entries.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">This Week's Ask</h3>
            {dashboard.lastRecommendations.length > 0 ? (
              dashboard.lastRecommendations.map((rec) => {
                const done = dashboard.revisited.some((t) =>
                  rec.toLowerCase().includes(t.name.toLowerCase())
                );
                return (
                  <div
                    key={rec}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl bg-slate-800/50 border-l-4 ${
                      done ? "border-emerald-400" : "border-amber-400"
                    }`}
                  >
                    <span className="text-sm text-slate-200">{rec}</span>
                    <span className="text-xs text-slate-400">{done ? "done" : "not done yet"}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-sm italic">No recommendations yet — generate an AI Recap first.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  hint
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg">
      <CardContent className="p-6">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${iconBg} w-fit mb-4`}>{icon}</div>
        <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
        <h3 className="text-4xl font-black text-white">{value}</h3>
        {hint && <p className="text-xs text-slate-500 mt-2">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 rounded-xl bg-slate-800/60">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </div>
  );
}

function WinItem({ label }: { label: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-xl">
      <span className="text-sm text-slate-200 font-medium">{label}</span>
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
    </div>
  );
}