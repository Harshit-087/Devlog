"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query"
import { userQuery } from "../api/userQuery";

 
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
    <Card className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Create Account</h2>
          <p className="text-sm text-slate-400 mt-1">
            Start your learning journey
          </p>
        </div>

        <div className="space-y-4">
          <input
          name="username"
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white outline-none"
          />

          <input
          name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white outline-none"
          />

          <input
          name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white outline-none"
          />
        </div>

        <Button type="submit" disabled={signupMutation.isPending} className="w-full rounded-xl">Sign Up</Button>
      </form>
    </Card>
  );
}