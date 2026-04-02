import { VerifyToken } from "../auth/auth"

export async function AuthMiddleware(req,res,next){
    const token = req.headers?.authorization?.splits(" ")[1];
    if(!token) return res.status(404).json({message:"not a valid user"})

      try{
        const decoded = VerifyToken(token);
        req.user = decoded;
        next();
      } catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
      } 
}