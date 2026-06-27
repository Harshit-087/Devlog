import { NextResponse } from "next/server"
import { axiosInstance } from "../../axiosInstance"

export async function POST(request: Request) {
  // Best-effort: tell backend too, in case it tracks sessions server-side
  await axiosInstance.post(`/user-api/v1/signout`)

  const response = NextResponse.json({ message: "user signed out" })
  response.cookies.delete("token")
  return response
}