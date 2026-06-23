import { jwtVerify } from "jose"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const token = request.cookies?.get("token")?.value
    const pathname = request.nextUrl.pathname

    // 1. If the token doesn't even exist, redirect to signin
    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url))
    }    

    try {
        // 2. Prepare your JWT secret key
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        
        // 3. Verify the token is legitimate and not expired
        await jwtVerify(token, secret);
        
        // If verification succeeds, let them pass
        return NextResponse.next()
    } catch (error) {
        // 4. If token is invalid or expired, clear it and redirect to signin
        console.error("JWT verification failed:", error)
        const response = NextResponse.redirect(new URL("/signin", request.url))
        response.cookies.delete("token") // Clean up the bad cookie
        return response
    }
}

export const config = {
    matcher: ["/"]
}