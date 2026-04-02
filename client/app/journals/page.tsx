"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  Sparkles,
  X,
} from "lucide-react";
import CreateJournal from "@/components/createJournal";

type Log = {
  day: string;
  title: string;
  details: string;
};

export default function Journal() {
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const logs = [
    {
      day: "Monday",
      title: "React Server Components",
      details:
        "Explored server components deeply and understood how they reduce bundle size.",
    },
    {
      day: "Tuesday",
      title: "API Route Architecture",
      details:
        "Created backend route flow with clean separation of controller logic.",
    },
    {
      day: "Wednesday",
      title: "Redux Persist Integration",
      details:
        "Implemented persisted authentication with local state recovery.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            placeholder="Search journals..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Popup Editor */}
      <CreateJournal/>

      </div>

     

      {/* Previous Journals */}
      <div className="grid gap-4">
        {logs.map((log, i) => (
          <Card
            key={i}
            onClick={() => setSelectedLog(log)}
            className="bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-800 transition"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays className="w-4 h-4" />
                  {log.day}
                </div>

                <h3 className="text-base text-white font-semibold">{log.title}</h3>

                <p className="text-sm text-slate-500 line-clamp-1">
                  {log.details}
                </p>
              </div>

              <Sparkles className="w-4 h-4 text-slate-500" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expanded Selected Journal */}
      {selectedLog && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <Card className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl">
      <CardContent className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-400">{selectedLog.day}</p>
            <h2 className="text-xl text-white font-semibold">{selectedLog.title}</h2>
          </div>

          <button onClick={() => setSelectedLog(null)}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
          <p className="text-slate-300 leading-relaxed">
            {selectedLog.details}
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setSelectedLog(null)}
            className="px-4 py-2 rounded-xl bg-white text-black font-medium"
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