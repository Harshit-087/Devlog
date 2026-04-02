import {jwtVerify } from "jose"
import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"

export async function middleware(request:NextRequest){
   
   
    const token = request.cookies?.get("token")?.value
   
    const pathname = request.nextUrl.pathname
  

    // const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    if(!token){
        if(pathname.startsWith("/journal")||pathname.startsWith("/ai-recap")||pathname.startsWith("/learning-gaps")){
           return NextResponse.redirect(new URL("/signin",request.url))
        }
    }    
    
   return NextResponse.next()
}
export const config={
    matcher:["/journal/:path*","/ai-recap/:path*","/learning-gaps/:path*"]
}