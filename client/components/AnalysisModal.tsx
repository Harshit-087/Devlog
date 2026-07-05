"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Lightbulb, X, Plus, Check, Quote } from "lucide-react";
import {Section} from "./section"

export type Analysis = {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  gaps: string[];
  recommendation: string[];
};

type AnalysisModalProps = {
  analysis: Analysis | null;
  onClose: () => void;
  addedGaps: Set<string>;
  onAddGap: (gap: string) => void;
  isAddingGap: boolean;
};

export default function AnalysisModal({ analysis, onClose, addedGaps, onAddGap, isAddingGap }: AnalysisModalProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {analysis && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050510]/80 backdrop-blur-lg p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Outer glow ring */}
            <div className="relative rounded-[28px] p-[1px] bg-gradient-to-br from-indigo-500/60 via-violet-500/30 to-transparent shadow-[0_0_60px_-15px_rgba(129,110,255,0.5)]">
              <div className="bg-[#0b0b17] rounded-[27px] max-h-[88vh] overflow-y-auto">

                {/* Header band */}
                <div className="relative px-8 pt-8 pb-6 overflow-hidden border-b border-white/5">
                  <div
                    className="absolute -top-24 -right-16 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, #7c6df0, transparent 70%)" }}
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase text-indigo-300/90 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          AI Recap
                        </span>
                      </div>
                      <h2 className="text-[26px] leading-tight font-bold text-white tracking-tight truncate pr-4">
                        {analysis.title}
                      </h2>
                    </div>
                    <button
                      onClick={onClose}
                      className="shrink-0 p-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="px-8 py-7 space-y-8">
                  {/* Summary — pull-quote style */}
                  <div className="relative pl-5">
                    <div className="absolute left-0 top-0.5 bottom-0.5 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
                    <Quote className="w-4 h-4 text-indigo-400/60 mb-2" />
                    <p className="text-[15px] text-slate-200/90 leading-relaxed italic">{analysis.summary}</p>
                  </div>

                  {/* Skills */}
                  <Section icon={<TrendingUp className="w-4 h-4" />} accent="emerald" label="Skills developed">
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-emerald-200 bg-emerald-400/10 border border-emerald-400/25"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Section>

                  {/* Gaps */}
                  <Section icon={<Lightbulb className="w-4 h-4" />} accent="amber" label="Learning gaps">
                    <div className="space-y-2">
                      {analysis.gaps.map((gap) => {
                        const added = addedGaps.has(gap);
                        return (
                          <div
                            key={gap}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3 hover:border-amber-400/30 transition"
                          >
                            <span className="text-[14px] text-slate-200">{gap}</span>
                            <button
                              onClick={() => !added && onAddGap(gap)}
                              disabled={added || isAddingGap}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold shrink-0 transition ${
                                added
                                  ? "bg-emerald-400/15 text-emerald-300 cursor-default"
                                  : "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
                              }`}
                            >
                              {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              {added ? "Added" : "Track this gap"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </Section>

                  {/* Recommendations */}
                  <Section icon={<Sparkles className="w-4 h-4" />} accent="violet" label="Recommended next">
                    <div className="space-y-2">
                      {analysis.recommendation.map((rec, i) => (
                        <div
                          key={rec}
                          className="flex items-start gap-3 rounded-xl border border-violet-400/15 bg-violet-400/[0.04] px-4 py-3"
                        >
                          <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-violet-400/15 text-violet-300 text-[11px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-[14px] text-slate-200 leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

