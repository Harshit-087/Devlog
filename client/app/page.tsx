"use client";

import {useState } from "react";
import { Search, Bell, User ,ChevronDown,LogOut} from "lucide-react";
import LearningGaps from "@/app/learning-gaps/page";
import AIRecap from "@/app/ai-recap/page";
import Journal from "@/app/journals/page";
import Dashboard from "@/app/dashboard/page";
import Sidebar from "@/components/sidebar";
import {useSelector, useDispatch} from "react-redux"
import type {initialState} from "@/store/router"
import Link from "next/link";
import { SignOut } from "@/store/router";
import { useMutation } from "@tanstack/react-query";
import { userQuery } from "./api/userQuery";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState<boolean>(false);
  const { isLogged,name } = useSelector((state: { user: initialState }) => state.user)
  const { data: session, status } = useSession()

  const dispatch = useDispatch()

const signOutMutation = useMutation({
  mutationFn: async () => {
    return await userQuery.signoutUser()
  },
  onSuccess: async (res) => {
    // 1. Clear your local Redux state first
    dispatch(SignOut())

    // 2. If NextAuth is authenticated, handle its signout completely
    if (status === "authenticated") {
      // Awaiting ensures NextAuth completely clears cookies/session before moving on
      await signOut({ redirect: false })
    }
    
    // 3. Finally, reload or redirect once everything is cleared
    window.location.reload()
  },
  onError: (error) => {
    console.log("error in signing out ", error.message)
  }
})

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Welcome back, {name}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Track learning, review progress, and improve daily.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 bg-slate-900/50 border border-slate-700 px-4 py-2 rounded-xl w-80 shadow-sm hover:bg-slate-900/70 transition">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  placeholder="Search logs, topics..."
                  className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
                />
              </div>

              {/* Actions */}
              <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition">
                <Bell className="w-5 h-5" />
              </button>

              <div className="relative">
                {isLogged ? (
                  <>
                    <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-700 transition"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {open && (
                      <div className="absolute right-0 mt-3 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden z-50">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition text-left"
                          onClick={() => {
                            signOutMutation.mutate()
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/signin">
                      <button className="px-4 py-2 text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition text-sm font-medium">
                        Sign In
                      </button>
                    </Link>

                    <Link href="/signup">
                      <button className="px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:opacity-90 transition text-sm font-medium">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8">
            {active === "dashboard" && <Dashboard />}
            {active === "journal" && <Journal />}
            {active === "recap" && <AIRecap />}
            {active === "gaps" && <LearningGaps />}
          </div>
        </div>
      </main>
    </div>
  );
}