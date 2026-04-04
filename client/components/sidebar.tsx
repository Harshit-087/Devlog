import { BookOpen,
  Brain,
  Calendar,
  BarChart3} from "lucide-react";
  import {Button} from "@/components/ui/button"
export default function Sidebar({ active, setActive }:{active:string,setActive:(val:string)=>void}) {
  const items = [
    { key: "dashboard", icon: BookOpen, label: "Dashboard" },
    { key: "journal", icon: Calendar, label: "Journal" },
    { key: "recap", icon: Brain, label: "AI Recap" },
    { key: "gaps", icon: BarChart3, label: "Learning Gaps" },
  ];

  return (
    <aside className="col-span-3 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-5 min-h-screen">

  {/* Brand */}
  <div className="pb-4 border-b border-slate-800">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
        <span className="text-indigo-400 font-bold text-lg">D</span>
      </div>

      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          DevLog AI
        </h1>
        <p className="text-slate-400 text-xs">
          Personal dev journal with intelligence
        </p>
      </div>
    </div>
  </div>

  {/* Navigation */}
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <Button
        key={item.key}
        variant="ghost"
        onClick={() => setActive(item.key)}
        className={`
          justify-start rounded-2xl px-4 py-6 text-sm font-medium transition-all duration-300
          ${
            active === item.key
              ? "bg-indigo-500/15 text-white border border-indigo-500/20 shadow-lg"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }
        `}
      >
        <item.icon
          className={`w-4 h-4 mr-3 ${
            active === item.key ? "text-indigo-400" : "text-slate-500"
          }`}
        />
        {item.label}
      </Button>
    ))}
  </div>

  {/* Bottom AI Tip */}
  {/* <div className="mt-auto bg-slate-800/60 rounded-2xl p-4 border border-slate-700">
    <p className="text-xs text-slate-400 mb-1">AI Suggestion</p>
    <p className="text-sm text-white leading-relaxed">
      Focus on backend consistency this week ⚡
    </p>
  </div> */}
</aside>
  );
}