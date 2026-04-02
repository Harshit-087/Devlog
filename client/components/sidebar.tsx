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
    <aside className="col-span-3 bg-slate-900 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">DevLog AI</h1>
        <p className="text-slate-400 text-sm">Personal dev journal with intelligence</p>
      </div>
      {items.map((item) => (
        <Button
          key={item.key}
          variant={active === item.key ? "default" : "ghost"}
          className="justify-start rounded-xl"
          onClick={() => setActive(item.key)}
        >
          <item.icon className="w-4 h-4 mr-2" />
          {item.label}
        </Button>
      ))}
    </aside>
  );
}