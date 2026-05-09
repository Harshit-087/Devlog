import { runWeeklyAnalysis,weeklyAnalysis_dashboard } from "../service/ai.services.js";
import prisma from "../config/connection.js"


export async function weeklyAnalysis(req, res) {
    const {id} = req.params;
    const {days} = req.query;
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
  console.log("controller",result)
  res.json({ result });
}


export const analysis_db = async(req,res)=>{
    const {id} = req.params;
    try{
        // const fetchAnalysisFromDb= await pool.query("SELECT * FROM weekly_analysis WHERE user_id=$1",[id])

       // using prisma
       const fetchAnalysisFromDb = await prisma.weekly_analysis.findMany({where:{user_id:Number(id)}});

        return res.status(200).json({message:"successfully fetched the analysis",data:fetchAnalysisFromDb})
    }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export const dashboard_analysis = async(req,res)=>{
    const {id} = req.params;
    // const {days} = req.query;
    console.log("ye lo:",id)
    const days = 1;
    const result = await weeklyAnalysis_dashboard(id,days);

    const {focus,progress} = result;
    // saving to db and using UPSERT (BY CUSTOM CONSTRAIN)
    const save_dashboard_analysis = await prisma.dashboard_insights.upsert({
        where: {
            user_id: Number(id)
        },
        update: {
            focus,
            progress
        },
        create: {
            user_id: Number(id),
            focus,
            progress
        }
    });

    //fetching 
    const dashboard = await prisma.dashboard_insights.findUnique({
        where:{
            user_id:Number(id)
        }
    })
      res.json({message:"dashboard analysis",data:dashboard})
}