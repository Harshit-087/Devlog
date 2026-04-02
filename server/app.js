import express from "express"
import cors from "cors"
import userRouter from "./routes/user.router.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:["content-type","Authorization"],
    credentials:true
}))

app.use("/user-api",userRouter)

app.listen(6000,()=>{
    console.log("server is runnning on port 6000")
})