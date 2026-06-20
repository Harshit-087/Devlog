"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { journalQuery } from "@/app/api/journalQuery";
import { useSelector } from "react-redux";
import { initialState } from "@/store/router";

export default function CreateJournal() {
  const [openEditor, setOpenEditor] = useState(false);
  const { id } = useSelector((state: { user: initialState }) => state.user);
  const queryClient = useQueryClient();

  const createJournalMutation = useMutation({
    mutationFn: async ({ payload, id }: { payload: { title: string; content: string }; id: string }) => {
      return await journalQuery.createJournal(payload, id);
    },
    onSuccess: (res) => {
      console.log("successfully created journal", res.data);
      queryClient.invalidateQueries({ queryKey: ["dashboard-analysis", id] });
      setOpenEditor(false); // Close modal only after a successful mutation
    },
    onError: (error) => {
      console.log("error in creating the journal", error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const title = (e.currentTarget as HTMLFormElement).topic as HTMLInputElement;
    const content = (e.currentTarget as HTMLFormElement).content as HTMLTextAreaElement;
    
    if (!title.value.trim() || !content.value.trim()) return;

    const payload = {
      title: title.value,
      content: content.value
    };
    
    createJournalMutation.mutate({ payload, id });
  };

  return (
    <>
      {/* Create Button */}
      <button
        onClick={() => setOpenEditor(true)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:opacity-90 transition shadow-lg"
      >
        <Plus className="w-4 h-4" />
        New Journal
      </button>

      {/* Modal */}
      <AnimatePresence>
        {openEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl"
            >
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Write Journal Entry
                      </h2>
                      <p className="text-sm text-slate-400">Share your learning progress and reflections</p>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setOpenEditor(false)} 
                      className="p-2 rounded-lg hover:bg-slate-700 transition"
                    >
                      <X className="w-5 h-5 text-slate-400 hover:text-white transition" />
                    </button>
                  </div>

                  <input
                    type="text"
                    name="topic"
                    placeholder="Journal title..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 outline-none text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition"
                  />

                  <textarea
                    rows={9}
                    name="content"
                    placeholder="Write your thoughts, learnings, and insights..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 outline-none resize-none text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition font-mono text-sm"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenEditor(false)}
                      className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
                      disabled={createJournalMutation.isPending}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createJournalMutation.isPending}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:opacity-90 transition shadow-lg disabled:opacity-50"
                    >
                      {createJournalMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {createJournalMutation.isPending ? "Publishing..." : "Publish Entry"}
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}