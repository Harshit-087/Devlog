"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query"
import { userQuery } from "../api/userQuery";
import AuthLayout from "@/components/authLayout";
import Link from "next/link";

 
export default function SignupCard() {
    const signupMutation = useMutation({
        mutationFn:async(payload:{name:string,email:string,password:string})=>{
            return await userQuery.signupUser(payload)
        },
        onSuccess:(res)=>{
            console.log("user created !!",res)
            window.location.href="/signin"
            
        },onError:(error)=>{
            console.log("error in creating user",error.message)
        }
    })

    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const name = (e.currentTarget as HTMLFormElement).username as HTMLInputElement;
        const email = (e.currentTarget as HTMLFormElement).email as HTMLInputElement;
        const password = (e.currentTarget as HTMLFormElement).password as HTMLInputElement;

        const payload={name:name.value,email:email.value,password:password.value}
        signupMutation.mutate(payload)
    }
  return (
   <AuthLayout>
  <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl shadow-black/30">
    <form onSubmit={handleSubmit} className="p-8 space-y-7">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-sm text-slate-400">
          Start your learning journey 🚀
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition">
          <input
            name="username"
            type="text"
            placeholder="Full Name"
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="bg-slate-800 rounded-2xl px-4 py-3 border border-slate-700 focus-within:border-indigo-500 transition">
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Button */}
      <Button
        type="submit"
        disabled={signupMutation.isPending}
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-6 text-base font-medium shadow-lg"
      >
        {signupMutation.isPending ? "Creating..." : "Sign Up"}
      </Button>

      {/* Footer */}
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
       <Link href="/signin"> <span className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
          Login
        </span>
        </Link>
      </p>
    </form>
  </Card>
</AuthLayout>
  );
}