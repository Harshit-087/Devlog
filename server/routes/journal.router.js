import express from "express"
import {createJournal,fetchJournal} from "../controllers/journal.controller.js"

const journalRouter = express.Router()

journalRouter.post("/create/:id",createJournal)
journalRouter.get("/journal/:id",fetchJournal)

export default journalRouter;