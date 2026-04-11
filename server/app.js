import express from "express"
import cors from "cors"
import userRouter from "./routes/user.router.js"
import dotenv from "dotenv"
import journalRouter from "./routes/journal.router.js"
import aiRouter from "./routes/ai.router.js"


const app = express()
 const PORT = process.env.PORT || 4500;

app.use(express.json())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods:["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders:["content-type","Authorization"],
    credentials:true
}))

app.use("/user-api/v1",userRouter)
app.use("/journal-api/v1",journalRouter)
app.use("/ai-api/v1",aiRouter)

app.listen(PORT,()=>{
    console.log("server is runnning on port 4500")
})