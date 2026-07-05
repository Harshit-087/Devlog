"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialState } from "@/store/router";
import { useSelector } from "react-redux";
import { aiQuery } from "../api/aiQuery";
import AnalysisModal, { Analysis } from "../../components/AnalysisModal";

export default function AIRecap() {
  const queryClient = useQueryClient();
  const [days, setDays] = useState<number>(7);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [addedGaps, setAddedGaps] = useState<Set<string>>(new Set());
  const { id } = useSelector((state: { user: initialState }) => state.user);

  const { data: analysis = [], isLoading } = useQuery<Analysis[]>({
    queryKey: ["ai-recap", id],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey as [string, string | undefined];
      if (!userId) throw new Error("No user Id found");
      const result = await aiQuery.fetchAIResponse(userId);
      return result.data.data as Analysis[];
    },
    enabled: !!id,
  });

  const aiRecapMutation = useMutation({
    mutationFn: async ({ id, days }: { id: string; days: number }) => {
      return await aiQuery.AIsummary(id, days);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-recap", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analysis", id] });
    },
  });

  const addGapMutation = useMutation({
    mutationFn: async (gap: string) => {
      return await aiQuery.addLearningGap(id, gap);
    },
    onSuccess: (_res, gap) => {
      setAddedGaps((prev) => new Set(prev).add(gap));
      queryClient.invalidateQueries({ queryKey: ["learning-gaps", id] });
    },
  });

  if (aiRecapMutation.isPending) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-indigo-400 mx-auto animate-pulse" />
          <p className="text-slate-400 text-lg">Generating your weekly analysis...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
          Weekly Recap
        </h2>
        <p className="text-slate-400 text-sm">AI-powered insights into your learning journey</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-slate-800/30 border border-slate-700/50 p-4 rounded-xl">
        <button
          onClick={() => aiRecapMutation.mutate({ id, days })}
          disabled={aiRecapMutation.isPending}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-medium shadow-lg disabled:opacity-60 transition flex items-center gap-2 justify-center sm:justify-start"
        >
          <Sparkles className="w-4 h-4" />
          {aiRecapMutation.isPending ? "Generating ...." : "Generate Analysis"}
        </button>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300 font-medium">Analyze:</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            disabled={aiRecapMutation.isPending}
            className="rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 hover:border-indigo-500/30 transition"
          >
            <option value={1}>Today</option>
            <option value={3}>Last 3 Days</option>
            <option value={7}>Last 7 Days</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl">
          <CardContent className="p-8 flex items-center justify-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
            <p className="text-slate-400">Loading your analysis...</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && analysis.length === 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-dashed border-slate-700/50 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition">
          <CardContent className="p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <p className="text-slate-400 mb-2">No AI recap yet</p>
              <p className="text-sm text-slate-500">Generate your first weekly analysis to see insights based on your learning</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {analysis.map((item: Analysis, idx: number) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <Card
              className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all shadow-lg cursor-pointer"
              onClick={() => setSelectedAnalysis(item)}
            >
              <CardContent className="p-6 relative flex justify-between items-center">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-1 mt-1">{item.summary.substring(0, 80)}...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnalysisModal
        analysis={selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        addedGaps={addedGaps}
        onAddGap={(gap) => addGapMutation.mutate(gap)}
        isAddingGap={addGapMutation.isPending}
      />
    </motion.div>
  );
}