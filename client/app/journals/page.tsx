"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  CalendarDays,
  Sparkles,
  X,
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700 px-4 py-3 rounded-2xl w-full max-w-md backdrop-blur-xl shadow-lg">
          <Search className="w-4 h-4 text-indigo-400" />
          <input
            placeholder="Search journals..."
            className="bg-transparent outline-none text-sm w-full text-white placeholder:text-slate-500"
          />
        </div>

        <CreateJournal />
      </div>

      {/* Journal Grid */}
      <div className="grid gap-5">
        {journals.map((log: Log, i: number) => (
          <Card
            key={i}
            onClick={() => setSelectedLog(log)}
            className="group bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl cursor-pointer hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <CardContent className="p-5 flex justify-between items-center relative">
              
              {/* Left Accent */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 via-violet-500 to-pink-500" />

              <div className="space-y-2 pl-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="w-4 h-4 text-indigo-400" />
                  {/* {log.created_at} */}
                </div>

                <h3 className="text-lg text-white font-semibold group-hover:text-indigo-300 transition">
                  {log.title}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-2 max-w-xl">
                  {log.content}
                </p>
              </div>

              <Sparkles className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
        >
          <Card className="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-3xl shadow-2xl">
            <CardContent className="p-7 space-y-6">
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo-400">Journal Entry</p>
                  <h2 className="text-2xl text-white font-bold">
                    {selectedLog.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-xl hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedLog.content}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium hover:opacity-90 transition"
                >
                  Close
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}