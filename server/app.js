import express from "express"
import cors from "cors"
import userRouter from "./routes/user.router.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:["content-type","Authorization"],
    credentials:true
}))

app.use("/user-api/v1",userRouter)

app.listen(4500,()=>{
    console.log("server is runnning on port 4500")
})