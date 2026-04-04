import pool from "../config/connection.js"


export const createJournal = async(req,res)=>{
    const {title,content} = req.body;
   const {id} = req.params;
    try{
       const createJournal = await pool.query("INSERT INTO journals(user_id,title,content) VALUES ($1,$2,$3)",[id,title,content])

       return res.status(201).json({message:"created journal"})
    }catch(error){
        return res.status(500).json({message:"interrnal server error "})
    }
}
export const fetchJournal = async(req,res)=>{
     console.log("request reached",req.params)
    const {id} = req.params;
    try{
        const myJournal = await pool.query("SELECT * FROM journals WHERE user_id=($1) ORDER BY created_at DESC",[id])
        return res.status(200).json({message:"successfully fetched my journal",data:myJournal.rows})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}