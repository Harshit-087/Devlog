import {prisma,pool} from "../config/connection.js"
import {GenerateToken} from "../auth/auth.js"

const getTokenConfig={
   httpOnly:true,
   sameSite:process.env.NODE_ENV==="production"?"none":"lax",
   secure:process.env.NODE_ENV==="production",
   maxAge:1000*60*60*24*7,
   path:"/"
}

export  const SignupUser =async(req,res)=>{
    
    const {name,email,password} = req.body;
    //  const userExist = await pool.query("SELECT * FROM users WHERE email =$1",[email]);

    // using prisma for find user exist
    const userExist = await prisma.users.find({email:email});

     if(userExist.rows.length!==0) return res.json({message:"user already exist"}) 
    try{
    //   const userCreated  =await pool.query("INSERT INTO users (name,email,password) VALUES($1,$2,$3)",[name,email,password]);
  

    // creating user via prisma
    const userCreated = await prisma.users.create({
        data:{
            name,
            email,password
        }
    })

      return res.status(201).json({message:"user created !!"})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export  const SigninUser =async(req,res)=>{
    //  console.log("request reached",req.body)
    const {email,password} = req.body;
    // const userExist = await pool.query("SELECT * FROM users WHERE email =$1",[email]);

     // using prisma for find user exist
    const userExist = await prisma.users.find({email:email});

    // console.log(userExist)
    if(userExist.rows.length===0) return res.status(404).json({message:"user not found"})
    try{
        //generating token
        const payload={email:email,password:password}
        const token = GenerateToken(payload)
    
        res.cookie("token",token,getTokenConfig)


        return res.status(200).json({message:"user login successfully",token:token,data:userExist.rows})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export const SignoutUser = async(req,res)=>{
    const {email } = req.body;
    try{
        // const deletedUser = await pool.query("DELETE FROM users WHERE email = $1",[email])

        // deleting user via prisma
        const deletedUser = await prisma.users.delete({email:email});

        res.clearCookie("token")

        return res.status(200).json({message:"the user is signed out"})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}