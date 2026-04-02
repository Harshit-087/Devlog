import { motion } from "framer-motion";
import {
  Flame,
  Brain,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-slate-400">+2 this week</span>
            </div>
            <h2 className="text-3xl font-bold">12 days</h2>
            <p className="text-sm text-slate-400 mt-2">Current streak</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Brain className="w-5 h-5 text-violet-400" />
              <span className="text-xs text-slate-400">Focus</span>
            </div>
            <h2 className="text-xl font-semibold">Backend Architecture</h2>
            <p className="text-sm text-slate-400 mt-2">
              API design, auth, caching
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-slate-400">AI insight</span>
            </div>
            <h2 className="text-lg font-semibold">Peak focus Tuesday ⚡</h2>
            <p className="text-sm text-slate-400 mt-2">
              Highest retention after coding sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress + Wins */}
      <div className="grid grid-cols-2 gap-5">
        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">Learning Progress</h3>
              <span className="text-sm text-slate-400">72%</span>
            </div>
            <Progress value={72} />
            <p className="text-sm text-slate-500">
              Strong consistency this week in implementation-heavy topics.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Recent Wins</h3>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between items-center">
                <span>Built route handlers</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex justify-between items-center">
                <span>Understood Prisma relations</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex justify-between items-center">
                <span>Server component practice</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}