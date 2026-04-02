"use client";

import { useState } from "react";
import { Search, Bell, User ,ChevronDown,LogOut} from "lucide-react";
import LearningGaps from "@/app/learning-gaps/page";
import AIRecap from "@/app/ai-recap/page";
import Journal from "@/app/journals/page";
import Dashboard from "@/app/dashboard/page";
import Sidebar from "@/components/sidebar";
import {useSelector} from "react-redux"
import { useDispatch } from "react-redux"; 
import type {initialState} from "@/store/router"
import Link from "next/link";
import { SignOut } from "@/store/router";
import { useMutation } from "@tanstack/react-query";
import { userQuery } from "./api/userQuery";

export default function Home() {
  const [active, setActive] = useState("dashboard");
  const [open,setOpen] = useState<boolean>(false);
  const {isLogged,email} = useSelector((state:{user:initialState})=>state.user)
  console.log("kya me login hu",isLogged)

  const dispatch = useDispatch()

  const signOutMutation = useMutation({
    mutationFn:async(email:string)=>{
      return await userQuery.signoutUser(email)
    },
    onSuccess:(res)=>{
      console.log("signout user",res.data.message)
    },
    onError:(error)=>{
      console.log("error in signing out ",error.message)
    }
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-800 bg-slate-900/70 backdrop-blur-xl">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Track learning, review progress, and improve daily.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl w-80 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                placeholder="Search logs, topics, insights..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-slate-500"
              />
            </div>

            {/* Actions */}
            <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition">
              <Bell className="w-5 h-5" />
            </button>

             <div className="relative">
      {isLogged ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
          >
            <User className="w-5 h-5" />
            <ChevronDown className="w-4 h-4" />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden z-50">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-900 transition"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              <button
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-900 transition text-left"
                onClick={() => {
                  dispatch( SignOut());
                  // signOutMutation.mutate(email)
                  console.log("logout");
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Link href="/signin">
            <button className="px-2 py-1 text-white bg-transparent rounded-lg">
              Sign In
            </button>
          </Link>

          <Link href="/signup">
            <button className="px-2 py-1 text-white bg-black rounded-lg">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
          </div>
        </header>

        {/* Dynamic Section */}
        <section className="space-y-6">
          {active === "dashboard" && <Dashboard />}
          {active === "journal" && <Journal />}
          {active === "recap" && <AIRecap />}
          {active === "gaps" && <LearningGaps />}
        </section>
      </main>
    </div>
  );
}