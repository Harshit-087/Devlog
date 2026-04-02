"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useDispatch} from "react-redux"
import {useMutation} from "@tanstack/react-query"
import { userQuery } from "../api/userQuery";
import { signIn } from "@/store/router";

export default function SigninCard() {
    const dispatch = useDispatch();

    const signinMutation =useMutation({
        mutationFn:async(payload:{email:string,password:string})=>{
            return await userQuery.signinUser(payload)
        },
        onSuccess:(res)=>{
            console.log("signin response",res.data)
            dispatch(signIn(res.data))
            
        },
        onError:(error)=>{
            console.log("error in signin",error.message)
        }
 } ) 

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const email = (e.currentTarget as HTMLFormElement).email as HTMLInputElement;
        const password =(e.currentTarget as HTMLFormElement).password as HTMLInputElement;
        const payload={
            email:email.value,
            password:password.value
        } 
        signinMutation.mutate(payload)
        window.location.href="/"
    }
  return (
    <Card className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sign In</h2>
          <p className="text-sm text-slate-400 mt-1">
            Access your DevLog account
          </p>
        </div>

        <div className="space-y-4">
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

        <Button type="submit" disabled={signinMutation.isPending} className="w-full rounded-xl">Sign In</Button>
      </form>
    </Card>
  );
}