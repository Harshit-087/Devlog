"use client";
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

// 1. Refined Type to match your actual usage

type TopicProgressMap = {
  [key: string]: number;
};

type DashboardAnalysis = {
  streak: number;
  progress: number;
  focusTopic: {
    focus: string[];
    progress: string ; // Handle both types
  };
  weeklyCount: number;
};

export default function Dashboard() {
  const { id } = useSelector((state: { user: initialState }) => state.user);

  const { data: dashboard, isLoading, isError } = useQuery<DashboardAnalysis>({
    queryKey: ["dashboard-analysis", id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey as [string, string | undefined];
      if (!id) throw new Error("No user ID found");
      
      const response = await aiQuery.fetchDashboardAnalysis(id);
      // Ensure we are returning the object directly
      return response.data.result as DashboardAnalysis; 
    },
    enabled: !!id, // Only run query if ID exists
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return <div className="text-red-400">Failed to load dashboard data.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-xs text-slate-400">+{dashboard.weeklyCount} this week</span>
            </div>
            <h2 className="text-4xl font-bold text-white">{dashboard.streak}</h2>
            <p className="text-sm text-slate-400 mt-1">day streak 🔥</p>
          </CardContent>
        </Card>

        {/* Focus Topics Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="p-2 rounded-xl bg-violet-500/10">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-xs text-slate-400">Focus Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dashboard.focusTopic?.focus.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topic Breakdown Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs text-slate-400">Breakdown</span>
            </div>
            {/* // Inside your component mapping... */}

            {/* progress */}
<div className="space-y-3">
  {dashboard?.focusTopic?.progress ? (() => {
    try {
      const progressData: TopicProgressMap = JSON.parse(dashboard.focusTopic.progress);
      const entries = Object.entries(progressData);
      
      // Get only the first 3 for the dashboard preview
      const top3 = entries.slice(0, 3);

      return (
        <>
          {/* Top 3 List */}
          <div className="space-y-2">
            {top3.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-xl text-white"
              >
                <span className="capitalize">{key}</span>
                <span className="text-emerald-400 font-mono">{value}%</span>
              </div>
            ))}
          </div>

          {/* Show More Button & Modal */}
          {entries.length > 3 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full text-xs text-slate-400 hover:text-white hover:bg-slate-800 mt-2"
                >
                  Show More (+{entries.length - 3})
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>All Focus Topics</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  {entries.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl"
                    >
                      <span className="capitalize font-medium">{key}</span>
                      <span className="text-emerald-400 font-mono font-bold">{value}%</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      );
    } catch (e) {
      return <p className="text-slate-500 text-xs">Error parsing progress data</p>;
    }
  })() : (
    <p className="text-slate-500 text-sm italic text-center">No progress recorded</p>
  )}
</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress + Wins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Overall Learning Progress</h3>
              <span className="text-sm text-emerald-400 font-medium">{dashboard.progress}%</span>
            </div>
            <Progress value={dashboard.progress} className="h-3 rounded-full" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Keep it up! You're making steady progress through your curriculum.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
          <CardContent className="p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white">Recent Wins 🏆</h3>
            <div className="space-y-4 text-sm text-slate-300">
              {/* If "Recent Wins" are dynamic, you should map them here as well */}
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

// Small helper component for the list
function WinItem({ label }: { label: string }) {
  return (
    <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-xl">
      <span>{label}</span>
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    </div>
  );
}