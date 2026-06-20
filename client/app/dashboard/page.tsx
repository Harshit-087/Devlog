"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Flame, Brain, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { initialState } from "@/store/router";
import { aiQuery } from "../api/aiQuery";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Strongly-typed model matching your incoming API structure
type DashboardAnalysisRaw = {
  streak: number;
  progress: number;
  focusTopic: {
    focus: string[];
    progress: string; 
  };
  weeklyCount: number;
};

// Parsed model structure for flawless type inference across the UI
type ParsedDashboardAnalysis = Omit<DashboardAnalysisRaw, 'focusTopic'> & {
  focusTopic: {
    focus: string[];
    progress: Record<string, number>;
  }
};

export default function Dashboard() {
  const { id } = useSelector((state: { user: initialState }) => state.user);

  const { data: dashboard, isLoading, isError } = useQuery<DashboardAnalysisRaw, Error, ParsedDashboardAnalysis>({
    queryKey: ["dashboard-analysis", id],
    queryFn: async ({ queryKey }) => {
      const [_, userId] = queryKey as [string, string | undefined];
      if (!userId) throw new Error("No user ID found");
      
      const response = await aiQuery.fetchDashboardAnalysis(userId);
      return response.data.result; 
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    // Safely parse the complex JSON string data once upon network retrieval
    select: (data) => {
      let parsedProgress: Record<string, number> = {};
      try {
        if (data.focusTopic?.progress) {
          parsedProgress = JSON.parse(data.focusTopic.progress);
        }
      } catch (e) {
        console.error("Failed to parse topic breakdown JSON data:", e);
      }
      return {
        ...data,
        focusTopic: {
          focus: data.focusTopic?.focus || [],
          progress: parsedProgress,
        }
      };
    }
  });

  // Calculate top values cleanly via useMemo 
  const progressEntries = useMemo(() => {
    if (!dashboard?.focusTopic?.progress) return [];
    return Object.entries(dashboard.focusTopic.progress);
  }, [dashboard]);

  const top3Entries = useMemo(() => progressEntries.slice(0, 3), [progressEntries]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return <div className="text-red-400 p-4 rounded-xl border border-red-500/20 bg-red-500/10">Failed to load dashboard metrics.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      {/* Top Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full">+{dashboard.weeklyCount} this week</span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-2">Streak</p>
            <h3 className="text-4xl font-black text-white">{dashboard.streak}</h3>
            <p className="text-xs text-slate-500 mt-2">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full">{dashboard.progress}%</span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-3">Overall Progress</p>
            <Progress value={dashboard.progress} className="bg-slate-700/50" />
          </CardContent>
        </Card>

        {/* Focus Topic Card */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-2">Primary Focus</p>
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {dashboard.focusTopic.focus[0] || "No primary topic set"}
            </h3>
          </CardContent>
        </Card>

        {/* Weekly Entries Card */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-2">Weekly Entries</p>
            <h3 className="text-4xl font-black text-white">{dashboard.weeklyCount}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Focus Topics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Focus Areas List */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-violet-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Focus Areas</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dashboard.focusTopic.focus.length > 0 ? (
                dashboard.focusTopic.focus.map((f, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30 hover:border-violet-500/50 transition"
                  >
                    {f}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No current topics logged.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Parsing and Topic Metric Split */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Topic Breakdown</h3>
            </div>
            
            {progressEntries.length > 0 ? (
              <>
                <div className="space-y-2">
                  {top3Entries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-xl text-white"
                    >
                      <span className="capitalize text-sm font-medium text-slate-200">{key}</span>
                      <span className="text-emerald-400 font-mono text-sm font-semibold">{value}%</span>
                    </div>
                  ))}
                </div>

                {progressEntries.length > 3 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full text-xs text-slate-400 hover:text-white hover:bg-slate-800 mt-2 rounded-xl"
                      >
                        Show More (+{progressEntries.length - 3})
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-md rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>All Focus Topics</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        {progressEntries.map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl"
                          >
                            <span className="capitalize font-medium text-slate-200">{key}</span>
                            <span className="text-emerald-400 font-mono font-bold">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-sm italic text-center py-4">No structural metrics found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress + Static Achievements Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Overall Learning Progress</h3>
              <span className="text-sm text-emerald-400 font-medium">{dashboard.progress}%</span>
            </div>
            <Progress value={dashboard.progress} className="h-3 rounded-full bg-slate-800" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Keep it up! You're making steady progress through your curriculum.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white">Recent Wins 🏆</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <WinItem label="Built route handlers" />
              <WinItem label="Understood Prisma relations" />
              <WinItem label="Server component practice" />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
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