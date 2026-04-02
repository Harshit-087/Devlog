import jwt from "jsonwebtoken"

export  function GenerateToken(payload){
    return jwt.sign(payload,process.env.SECRET,{expiresIn:"7d"})
}

export  function VerifyToken(token){
    return  jwt.verify(token,process.env.SECRET)
}