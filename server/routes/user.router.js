import express from "express"
import {SignupUser,SigninUser,SignoutUser,GoogleSignin} from "../controllers/user.controller.js"

const userRouter = express.Router()


userRouter.post("/signup",SignupUser)
userRouter.post("/signin",SigninUser)
userRouter.post("/signout",SignoutUser)

userRouter.post("/googleSignin",GoogleSignin)

export default userRouter;