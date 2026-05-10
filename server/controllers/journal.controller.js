import {prisma} from "../config/connection.js"
import {setCache,getCache} from "../service/redis/cache.js"
import {redis} from "../config/connection.js"

export const createJournal = async(req,res)=>{
     try{
    const {title,content} = req.body;
   const {id} = req.params;
    
   // invalidate the cache ..
   await redis.del(`journal:${id}`);

    //    const createJournal = await pool.query("INSERT INTO journals(user_id,title,content) VALUES ($1,$2,$3)",[id,title,content])

    // using prisma
    const createJournal = await prisma.journals.create({
        data:{
            user_id:Number(id),
            title,
            content
        }
    })

       return res.status(201).json({message:"created journal"})
    }catch(error){
        return res.status(500).json({message:"interrnal server error "})
    }
}



export const fetchJournal = async(req,res)=>{
   try{  
     const {id} = req.params;

     // get from cache
     const key = `journal:${id}`
     const data = await  getCache(key)
     if(data) return res.status(200).json({message:"cached journal",data:data})
    
        // const myJournal = await pool.query("SELECT * FROM journals WHERE user_id=($1) ORDER BY created_at DESC",[id])

       // using prisma
       const myJournal = await prisma.journals.findMany({where:{user_id:Number(id)}})

       // set in cache
       await setCache(key,myJournal,600)

        return res.status(200).json({message:"successfully fetched my journal",data:myJournal})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

