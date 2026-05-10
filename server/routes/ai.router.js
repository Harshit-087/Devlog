import express from "express"
import { weeklyAnalysis ,analysis_db,getDashboardMetrics} from "../controllers/ai.controller.js";


const aiRouter = express.Router()


aiRouter.get("/summary/:id",weeklyAnalysis)
aiRouter.get("/analysis/:id",analysis_db)
aiRouter.get("/dashboard/:id",getDashboardMetrics)

export default aiRouter;