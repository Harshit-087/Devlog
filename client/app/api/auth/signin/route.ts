import { NextResponse } from "next/server"
import {axiosInstance} from "../../axiosInstance" // adjust path to match your structure

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const backendRes = await axiosInstance.post("/user-api/v1/signin", body)
    const data = backendRes.data

    const response = NextResponse.json({ message: data.message, data: data.data })

    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error: any) {
    // axios throws on non-2xx — this is where 404 "user not found" etc. land
    const status = error.response?.status || 500
    const data = error.response?.data || { message: "internal server error" }
    return NextResponse.json(data, { status })
  }
}