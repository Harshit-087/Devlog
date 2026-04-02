import {motion} from "framer-motion"
import { Card, CardContent } from "@/components/ui/card";

export default function LearningGaps() {
  const suggestions = ["Revise auth", "Practice system design", "Explore caching"];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
      {suggestions.map((item, i) => (
        <Card key={i} className="bg-slate-900 rounded-2xl"><CardContent className="p-5">{item}</CardContent></Card>
      ))}
    </motion.div>
  );
}