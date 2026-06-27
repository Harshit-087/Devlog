import { jwtVerify } from "jose"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const token = request.cookies?.get("token")?.value
    const pathname = request.nextUrl.pathname

    const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");

    // 1. If no token exists
    if (!token) {
        // If they are ALREADY going to signin/signup, let them pass!
        if (isAuthPage) {
            return NextResponse.next();
        }
        // Otherwise, kick them back to login
        return NextResponse.redirect(new URL("/signin", request.url))
    }    

    try {
        // 2. Prepare secret
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        
        // 3. Verify token
        await jwtVerify(token, secret);
        
        // 💡 OPTIONAL BONUS: If they HAVE a valid token and try to visit /signin,
        // redirect them automatically to the dashboard instead of showing the form again
        if (isAuthPage) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next()
    } catch (error) {
        console.error("JWT verification failed:", error)
        
        // If they are already on the signin page, don't loop redirect
        if (isAuthPage) {
            return NextResponse.next();
        }

        const response = NextResponse.redirect(new URL("/signin", request.url))
        response.cookies.delete("token") 
        return response
    }
}

// Update your matcher to monitor your protected dashboards cleanly
export const config = {
    matcher: ["/", "/dashboard/:path*", "/signin", "/signup"]
}