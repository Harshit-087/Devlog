"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { journalQuery } from "@/app/api/journalQuery";

export default function CreateJournal() {
  const [openEditor, setOpenEditor] = useState(false);

  const createJournalMutation = useMutation({
    mutationFn:async(payload:{title:string,content:string})=>{
        return await journalQuery.createJournal(payload)
    },
    onSuccess:(res)=>{
        console.log("successfully created journal",res.data)
    },
    onError:(error)=>{
        console.log("error in creating the journal",error.message)
    }
  })

  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    const title = (e.currentTarget as HTMLFormElement).topic as HTMLInputElement;
    const content =(e.currentTarget as HTMLFormElement).content as HTMLTextAreaElement
 
    const payload={
        title:title.value,
        content:content.value
    }
    createJournalMutation.mutate(payload);
  }

  return (
    <>
      {/* Create Button */}
      <button
        onClick={() => setOpenEditor(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white text-black font-medium hover:scale-[1.02] transition"
      >
        <Plus className="w-4 h-4" />
        Create Journal
      </button>

      {/* Modal */}
      <AnimatePresence>
        {openEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl px-4"
            >
              <Card className="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl">
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">
                      Write Journal
                    </h2>

                    <button onClick={() => setOpenEditor(false)}>
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <input
                  type="text"
                  name="topic"
                    placeholder="Journal title..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none text-white"
                  />

                  <textarea
                    rows={8}
                    name="content"
                    placeholder="Write your thoughts..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none resize-none text-white"
                  />

                  <div className="flex justify-end">
                    <button type="submit" className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition">
                      Publish
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