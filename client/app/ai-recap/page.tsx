"use client"
import {useState} from "react"
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialState } from "@/store/router";
import { useSelector } from "react-redux";
import { aiQuery } from "../api/aiQuery";

type Analysis = {
  id: string;
  title:string
  summary: string;
  skills: string[];
  gaps: string[];
  recommendation: string[];
};

export default function AIRecap() {
  const queryClient = useQueryClient();
  const [ days,setDays] = useState<number>(1)
  const { id } = useSelector((state: { user: initialState }) => state.user);

  // analysis
  const { data: analysis = [], isLoading, isError } = useQuery<Analysis[]>({
    queryKey: ["ai-recap", id],
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey as [string, string | undefined];
      if (!id) throw new Error("No user Id found") ;

      const result = await aiQuery.fetchAIResponse(id);
      console.log("fetched analysis from backend",result.data.data)
      return result.data.data as Analysis[];
    },
    enabled: !!id,
  });



  // summary
  const aiRecapMutation = useMutation({
    mutationFn: async ({id,days}:{id: string,days:number}) => {
      return await aiQuery.AIsummary(id,days);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ai-recap", id],
      });
    },
  });

  if(aiRecapMutation.isPending) return <p> generating analysis ....</p>

  

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    // h-full: Uses the space provided by Wrapper
    // overflow-y-auto: Creates the internal scrollbar
     className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4"
  >
  <button
    onClick={() => aiRecapMutation.mutate({id,days})}
    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white shadow-lg"
  >
    Generate Weekly Analysis ✨
  </button>
  
  <select
  value={days}
  onChange={(e) => setDays(Number(e.target.value))}
  disabled={aiRecapMutation.isPending} className="bg-black/50">
    <option  value={1}>today</option>
    <option  value={3}>last 3 days</option>
    <option  value={7}>last 7 days</option>
  </select>

  {isLoading && (
    <Card className="bg-slate-900 rounded-2xl">
      <CardContent className="p-6 text-white">
        Loading analysis...
      </CardContent>
    </Card>
  )}

  {!isLoading && analysis.length === 0 && (
    <Card className="bg-slate-900 rounded-2xl border border-dashed border-slate-700">
      <CardContent className="p-6 text-center text-slate-400">
        No AI recap yet. Generate your first weekly analysis ✨
      </CardContent>
    </Card>
  )}

  {analysis.map((item: Analysis) => (
    <motion.div
      key={item.id}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="w-full flex-none"
    >
      <details className="group">
        <summary className="list-none cursor-pointer">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 shadow-lg hover:border-indigo-500/30 transition">
            <CardContent className="p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>

              <span className="text-slate-400 group-open:rotate-180 transition">
                ▼
              </span>
            </CardContent>
          </Card>
        </summary>

        <Card className="bg-slate-950 border border-slate-800 rounded-2xl mt-3">
          <CardContent className="p-6 space-y-6 text-white">
            
            <div>
              <h3 className="text-slate-400 text-sm mb-2">Summary</h3>
              <p className="text-slate-200 leading-relaxed">{item.summary}</p>
            </div>

            <div>
              <h3 className="text-slate-400 text-sm mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-slate-400 text-sm mb-2">Learning Gaps</h3>
              <ul className="space-y-2">
                {item.gaps.map((gap) => (
                  <li
                    key={gap}
                    className="bg-slate-800 px-3 py-2 rounded-xl text-slate-300"
                  >
                    {gap}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-slate-400 text-sm mb-2">Recommendations</h3>
              <ul className="space-y-2">
                {item.recommendation.map((rec) => (
                  <li
                    key={rec}
                    className="bg-slate-800 px-3 py-2 rounded-xl text-slate-300"
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </details>
    </motion.div>
  ))}
</motion.div>
  );
}