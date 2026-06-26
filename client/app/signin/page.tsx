"use client";
import {useEffect} from "react"
import {motion} from "framer-motion"
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {useDispatch} from "react-redux"
import {useMutation} from "@tanstack/react-query"
import { userQuery } from "../api/userQuery";
import { logIn } from "@/store/router";
import {LogIn} from "lucide-react"
import AuthLayout from "@/components/authLayout";
import Link from "next/link";
import {useRouter} from "next/navigation"
import {signIn,signOut,useSession} from "next-auth/react"

export default function SigninCard() {
 
    const {data:session} = useSession();
    console.log(session);

    const dispatch = useDispatch();
    const router = useRouter()
    
    const signinMutation =useMutation({
        mutationFn:async(payload:{email:string,password:string})=>{
            return await userQuery.signinUser(payload)
        },
        onSuccess:(res)=>{
            console.log("signin response",res.data)
            dispatch(logIn(res.data))
            router.push("/")
        },
        onError:(error)=>{
            console.log("error in signin",error.message)
        }
 } ) 

    const googleSigninMutation =useMutation({
        mutationFn:async(payload:{email:string,name:string})=>{
            return await userQuery.googleSignin(payload)
        },
       onSuccess: (res) => {
    // res.data is the Axios response body: { message, token, data: userExist }
    console.log("signin response", res.data);
    
    // Pass the actual user record (res.data.data) to your Redux action
    const userData = res.data; 
    
    if (userData) {
        dispatch(logIn(userData));
        router.push("/");
    } else {
        console.error("User object is missing in backend response");
    }
},
        onError:(error)=>{
            console.log("error in signin",error.message)
        }
 } ) 


useEffect(() => {
    if (session?.user?.email && session?.user?.name) {
      const payload = {
        name: session.user.name,
        email: session.user.email
      };
      
      // Trigger the backend sync
      googleSigninMutation.mutate(payload);
    }
  }, [session]);

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const email = (e.currentTarget as HTMLFormElement).email as HTMLInputElement;
        const password =(e.currentTarget as HTMLFormElement).password as HTMLInputElement;
        const payload={
            email:email.value,
            password:password.value
        } 
        signinMutation.mutate(payload)
       
    }
  return (
    <AuthLayout>
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              <div className="p-3 rounded-2xl bg-indigo-500/20">
                <LogIn className="w-6 h-6 text-indigo-400" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>

            <p className="text-sm text-slate-400">
              Sign in to continue your developer journey
            </p>
          </div>

          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-indigo-500 transition"
            />
          </div>

          <Button
            type="submit"
            disabled={signinMutation.isPending}
            className="w-full rounded-xl h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-500 transition"
          >
            {signinMutation.isPending ? "Signing In..." : "Sign In"}
          </Button>

          {signinMutation.isError && (
            <p className="text-sm text-red-400 text-center">
              Invalid email or password
            </p>
          )}
           </form>

           <button
      onClick={() => signIn("google")}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Sign In with Google
    </button>

           <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
       <Link href="/signup"> <span className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition">
          signup
        </span>
        </Link>
      </p>
       
      </Card>
    </motion.div>
    </AuthLayout>
  );
}

  {/* <button 
          onClick={() => signOut()} 
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Sign Out
        </button> */}