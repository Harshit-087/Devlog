
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-500/20 blur-3xl rounded-full top-[-120px] left-[-120px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Left Branding */}
      <div className="hidden lg:flex items-center justify-center px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg space-y-6"
        >
          <h1 className="text-5xl font-bold leading-tight">
            Build consistency. <br />
            Learn smarter. 🚀
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed">
            DevLog helps you record daily development progress, detect learning
            gaps, and generate weekly AI-powered growth insights.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
              <h3 className="font-semibold">AI Weekly Recap</h3>
              <p className="text-sm text-slate-400 mt-2">
                Summarize your learning automatically.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
              <h3 className="font-semibold">Learning Gaps</h3>
              <p className="text-sm text-slate-400 mt-2">
                Find what to study next.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center px-6 relative z-10">
        {children}
      </div>
    </div>
  );
}