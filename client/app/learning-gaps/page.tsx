"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Target, Zap, LucideIcon } from "lucide-react";

interface SuggestionItem {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: "amber" | "indigo" | "purple" | "emerald";
}

export default function LearningGaps() {
  const suggestions: SuggestionItem[] = [
    { title: "Revise Auth", desc: "Authentication & Authorization patterns", icon: Zap, color: "amber" },
    { title: "Practice System Design", desc: "Distributed systems and scalability", icon: Target, color: "indigo" },
    { title: "Explore Caching", desc: "Redis and caching strategies", icon: Lightbulb, color: "purple" },
    { title: "Advanced React Patterns", desc: "Context, custom hooks, and optimization", icon: BookOpen, color: "emerald" },
  ];

  const colors = {
    amber: "from-amber-500/20 to-orange-500/20",
    indigo: "from-indigo-500/20 to-violet-500/20",
    purple: "from-purple-500/20 to-pink-500/20",
    emerald: "from-emerald-500/20 to-teal-500/20",
  };

  const borderColors = {
    amber: "hover:border-amber-500/50",
    indigo: "hover:border-indigo-500/50",
    purple: "hover:border-purple-500/50",
    emerald: "hover:border-emerald-500/50",
  };

  const textColors = {
    amber: "text-amber-400",
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">
          Learning Gaps
        </h2>
        <p className="text-slate-400 text-sm">Topics to focus on based on your learning patterns</p>
      </div>

      {/* Grid of Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((item, i) => {
          const Icon = item.icon;
          const bgColor = colors[item.color];
          const borderColor = borderColors[item.color];
          const textColor = textColors[item.color];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl cursor-pointer ${borderColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="p-6 relative">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} w-fit mb-4`}>
                    <Icon className={`w-6 h-6 ${textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 group-hover:text-slate-300 transition">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recommendation Section */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-indigo-500/20 rounded-2xl overflow-hidden group hover:border-indigo-500/50 transition-all relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5 group-hover:from-indigo-500/10 group-hover:to-violet-500/10 transition-all" />
        <CardContent className="p-8 relative">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Tip 💡</h3>
              <p className="text-slate-300">
                Focus on one learning gap at a time. Dedicate 30 minutes daily to practice and review. Your consistency matters more than the duration!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}