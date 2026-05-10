import { runWeeklyAnalysis,weeklyAnalysis_dashboard } from "../service/ai.services.js";
import {prisma} from "../config/connection.js"
import {setCache,getCache} from "../service/redis/cache.js"

export async function weeklyAnalysis(req, res) {
    try{
    const {id} = req.params;
    const {days} = req.query;

    if(!id ) return res.status(401).json({message:"unauthorizied user"})
   
    // redis cache
    const key = `summary-${id}`
    const data = await  getCache(key)
    if(data) return res.status(200).json({message:"cached summary",data:data})

  const result = await runWeeklyAnalysis(id,days);

  const {title,summary,skills,gaps,recommendation } = result

  // saving to db
  // 2. Saving to DB using Prisma
        // Prisma uses object mapping, so no need for $1, $2 variables
        const saving_analysis = await prisma.weekly_analysis.create({
            data: {
                user_id: Number(id),      // Ensure the field name matches your schema.prisma
                title,
                summary,
                skills,
                gaps,
                recommendation
            }
        });

          // set in cache
          await setCache(key,result,600)

  console.log("controller",result)
      res.satus(200).json({ message:"summary created",result });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}


export const analysis_db = async(req,res)=>{
   try{
    const {id} = req.params;
 
    if(!id ) return res.status(401).json({message:"unauthorizied user"})

      // get from redis cache
      const key = `analysis:${id}`
       const data = await  getCache(key)
    if(data) return res.status(200).json({message:"cached analysis",data:data})
  
        // const fetchAnalysisFromDb= await pool.query("SELECT * FROM weekly_analysis WHERE user_id=$1",[id])
       
       // using prisma
       const fetchAnalysisFromDb = await prisma.weekly_analysis.findMany({where:{user_id:Number(id)}});


       // set in cache
       await setCache(key,fetchAnalysisFromDb,600)

        return res.status(200).json({message:"successfully fetched the analysis",data:fetchAnalysisFromDb})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}


export const getDashboardMetrics = async (req, res) => {
    // const userId = Number(req.user.id); // From your auth middleware
    try{
    const {id} = req.params;
    const userId = Number(id);
   
    if(!id || !userId) return res.status(401).json({message:"unauthorizied user"})

    // get from cache
    const key = `dashbard:${id}`
     const data = await  getCache(key)
    if(data) return res.status(200).json({message:"cached dashboard",result:data})


        // 1. Get Streak (Calling the logic we discussed)
        const streak = await calculateStreak(userId);

        // 2. Define Weekly Target
        const WEEKLY_GOAL = 5; // The "expectation"

        // 3. Set timeframe to "Start of Current Week" (Sunday 00:00:00)
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // 22 date - 0(sunday) = 22
        
        // 4. Count entries since start of week
        // SQL: SELECT COUNT(*) FROM journals WHERE user_id = userId AND created_at >= startOfWeek
        const weeklyCount = await prisma.journals.count({
            where: {
                user_id: userId,
                created_at: { gte: startOfWeek }
            }
        });

        const progress = Math.min((weeklyCount / WEEKLY_GOAL) * 100, 100);
        // // 3. Get Focus Topic (AI Logic)
        // const recentJournals = await prisma.journals.findMany({
        //     where: { user_id: userId },
        //     take: 5,
        //     orderBy: { created_at: 'desc' },
        //     select: { content: true }
        // });
        
        // Pass to your AI service to get a single keyword
        const focusTopic = await weeklyAnalysis_dashboard(userId,5);

        const result = {
            streak,
            progress,
            focusTopic,
            weeklyCount
        };

         // set in cache
         await setCache(key,result,600)
   

         console.log("fous topic",streak,progress,focusTopic,weeklyCount)
        return res.status(200).json({result});

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const calculateStreak = async (userId) => {
  // Fetch unique dates only (optimized)
  const logs = await prisma.journals.findMany({
    where: { user_id: userId },
    select: { created_at: true },
    orderBy: { created_at: 'desc' },
  });

  if (logs.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].created_at);
    logDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffInDays === 1) {
      // User hasn't posted today yet, but posted yesterday
      continue; 
    } else {
      break; // Streak broken
    }
  }
  return streak;
};