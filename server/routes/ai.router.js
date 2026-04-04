import express from "express"
import { weeklyAnalysis ,analysis_db,dashboard_analysis} from "../controllers/ai.controller.js";


const aiRouter = express.Router()


aiRouter.get("/summary/:id",weeklyAnalysis)
aiRouter.get("/analysis/:id",analysis_db)
aiRouter.get("/dashboard/:id",dashboard_analysis)

export default aiRouter;