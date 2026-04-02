import {motion} from "framer-motion"
import {  Sparkles} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AIRecap() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="bg-slate-900 rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2"><Sparkles className="w-5 h-5" /><h2>AI Weekly Recap</h2></div>
          <p>This week improved backend reasoning and relational thinking.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
