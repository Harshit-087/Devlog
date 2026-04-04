"use client"
import { motion } from "framer-motion";
import {useQuery} from "@tanstack/react-query" 
import {
  Flame,
  Brain,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { initialState } from "@/store/router";
import { aiQuery } from "../api/aiQuery";

type DashboardAnalysis = {
  focus?: string[];
  progress?: Record<string, string | number>;
};

export default function Dashboard() {

    const {id} = useSelector((state:{user:initialState})=>state.user)

     const {data:dashboard=[],isLoading,isError} = useQuery<DashboardAnalysis[]>({
         queryKey:["dashboard-analysis",id],
          queryFn:async({queryKey})=>{
            const [_,id] = queryKey as [string ,string|undefined]
            if(!id) return []
            const response = await aiQuery.fetchDashboardAnalysis(id)
            console.log("response",response.data.data)
            return response.data.data
          },
          staleTime:1000*60*10
     })


  return (
    <motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="space-y-6"
>
  {/* Top Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    
    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="p-2 rounded-xl bg-orange-500/10">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <span className="text-xs text-slate-400">+2 this week</span>
        </div>

        <h2 className="text-4xl font-bold text-white">12</h2>
        <p className="text-sm text-slate-400 mt-1">day streak 🔥</p>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="p-2 rounded-xl bg-violet-500/10">
            <Brain className="w-5 h-5 text-violet-400" />
          </div>
          <span className="text-xs text-slate-400">Focus</span>
        </div>


       <div className="flex flex-wrap gap-2">
  {dashboard && dashboard.length>0 ?dashboard?.[0].focus?.map((f: string, i: number) => (
    <span
      key={i}
      className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
    >
      {f}
    </span>
  )) : <div className="text-white">loading....</div>}
</div>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-5">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400">progress</span>
        </div>
        
         {dashboard && dashboard.length>0 && Object.entries(dashboard[0].progress ?? {}).map(([key,value])=>(
            <div
        key={key}
        className="flex justify-between items-center bg-slate-800/50 px-3 py-2 rounded-xl text-white"
      >
        <span>{key}</span>
        <span>{value}</span>
      </div>
   ))}
        
        
      </CardContent>
    </Card>
  </div>

  {/* Progress + Wins */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
      <CardContent className="p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
          <span className="text-sm text-emerald-400 font-medium">72%</span>
        </div>

        <Progress value={72} className="h-3 rounded-full" />

        <p className="text-sm text-slate-400 leading-relaxed">
          Strong consistency this week in implementation-heavy topics.
        </p>
      </CardContent>
    </Card>

    <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-xl">
      <CardContent className="p-6 space-y-5">
        <h3 className="text-lg font-semibold text-white">Recent Wins 🏆</h3>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-xl">
            <span>Built route handlers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-xl">
            <span>Understood Prisma relations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-xl">
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