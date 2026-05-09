import express from "express"

import {createJournal,fetchJournal} from "../controllers/journal.controller.js"

const journalRouter = express.Router()

journalRouter.post("/create/:id",createJournal)

// fetching all journal of a user (user_id)
journalRouter.get("/journal/:id",fetchJournal)




export default journalRouter;