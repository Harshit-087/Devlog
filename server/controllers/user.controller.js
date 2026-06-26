import {prisma} from "../config/connection.js"
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
    const userExist = await prisma.users.findUnique({where: { email: email }});

     if(userExist) return res.json({message:"user already exist"}) 
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
//     const test = await pool.query("SELECT NOW()");
// console.log("DB WORKING:", test.rows);
// const allUsers = await pool.query("SELECT * FROM users");
// console.log("USERS FROM BACKEND:", allUsers.rows);
    const {email,password} = req.body;

    // const userExist = await pool.query("SELECT * FROM users WHERE email =$1",[email]);

     // using prisma for find user exist
    const userExist = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

    // console.log(userExist)
    if(userExist===null) return res.status(404).json({message:"user not found"})
    try{
        //generating token
        const payload={email:email}
        const token = GenerateToken(payload)
    
        res.cookie("token",token,getTokenConfig)


        return res.status(200).json({message:"user login successfully",token:token,data:userExist})
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

// google sigin
export const GoogleSignin=async(req,res)=>{
    const {name,email} = req.body;
    try{
        const userExist = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

        let finalUser = userExist;
        if(!userExist){
         finalUser= await prisma.users.create({
            data:{
            name,
            email,
            password:"OAUTH_GOOGLE_USER_ACCOUNT"   // !!!!change this later ... (temporary)
            }
        })
    }
        const payload = {email:email}
        const token = GenerateToken(payload)

        res.cookie("token",token,getTokenConfig)

        // Keep track of the final user object
    

      return res.status(200).json({message:"user login successfully",token:token,data:finalUser})
    }catch(error){
        console.log("error in google signin",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    
  }
}