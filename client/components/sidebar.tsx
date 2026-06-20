import { BookOpen,
  Brain,
  Calendar,
  BarChart3,
  Zap,
  Sparkles} from "lucide-react";
  import {Button} from "@/components/ui/button"
export default function Sidebar({ active, setActive }:{active:string,setActive:(val:string)=>void}) {
  const items = [
    { key: "dashboard", icon: BookOpen, label: "Dashboard" },
    { key: "journal", icon: Calendar, label: "Journal" },
    { key: "recap", icon: Brain, label: "AI Recap" },
    { key: "gaps", icon: BarChart3, label: "Learning Gaps" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800 shadow-2xl flex flex-col overflow-y-auto z-40">
      {/* Brand */}
      <div className="sticky top-0 bg-gradient-to-b from-slate-950 to-slate-900/50 p-6 border-b border-slate-800/50 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              DevLog
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              AI Learning Hub
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 p-4 flex-1">
        {items.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            onClick={() => setActive(item.key)}
            className={`justify-start rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 group ${
              active === item.key
                ? "bg-gradient-to-r from-indigo-600/30 to-violet-600/30 text-white border border-indigo-500/40 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <item.icon
              className={`w-5 h-5 mr-3 transition-all ${
                active === item.key ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"
              }`}
            />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Footer Tip */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-semibold text-slate-300">Pro Tip</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Review your learning gaps weekly for better progress
          </p>
        </div>
      </div>
    </aside>
  );
}