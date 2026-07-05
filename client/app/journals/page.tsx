"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  CalendarDays,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";
import CreateJournal from "@/components/createJournal";
import { useSelector } from "react-redux";
import { initialState } from "@/store/router";
import { journalQuery } from "../api/journalQuery";
import { useQuery } from "@tanstack/react-query";

type Log = {
  id: string;
  title: string;
  content: string;
  created_at: Date;
};

export default function Journal() {
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const { id } = useSelector((state: { user: initialState }) => state.user);

  const {
    data: journals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-journal", id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey as [string, string | undefined];
      if (!id) return [];
      const result = await journalQuery.fetchJournal(id);
      return result.data.data;
    },
    enabled: !!id,
  });

  return (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-1">Your Journals</h2>
            <p className="text-sm text-slate-400">Track your learning journey one entry at a time</p>
          </div>
          <CreateJournal/>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-slate-800/30 border border-slate-700/50 px-4 py-3 rounded-xl max-w-lg hover:bg-slate-800/50 transition">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            placeholder="Search your journals..."
            className="bg-transparent outline-none text-sm w-full text-white placeholder:text-slate-500"
          />
        </div>

        {/* Journal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {journals.map((log: Log, i: number) => (
            <Card
  key={log.id ?? i}
  onClick={() => setSelectedLog(log)}
  className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
>
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
              <CardContent className="p-6 relative space-y-3">
                {/* Left Accent */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500 group-hover:w-1.5 transition-all" />

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-2 mb-2">
                      {log.title}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                      {log.content}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition shrink-0 ml-2" />
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400 transition">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(log.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {journals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-slate-700/50 bg-slate-900/20">
            <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
            <p className="text-slate-400 text-center">No journals yet. Start by creating your first entry!</p>
          </div>
        )}

        {/* Modal */}
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-2xl">
              <CardContent className="p-8 space-y-6">
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-indigo-400 font-medium">Journal Entry</p>
                    <h2 className="text-3xl text-white font-bold mt-1">
                      {selectedLog.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setSelectedLog(null)}
                    className="p-2 rounded-xl hover:bg-slate-700 transition"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedLog.content}
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:opacity-90 transition"
                  >
                    Done
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}