import { runWeeklyAnalysis,weeklyAnalysis_dashboard } from "../service/ai.services.js";
import pool from "../config/connection.js"

export async function weeklyAnalysis(req, res) {
    const {id} = req.params;
    const {days} = req.query;
  const result = await runWeeklyAnalysis(id,days);

  const {title,summary,skills,gaps,recommendation } = result

  // saving to db
  const saving_analysis = await pool.query("INSERT INTO weekly_analysis(user_id,title,summary,skills,gaps,recommendation) VALUES ($1,$2,$3,$4,$5,$6)",[id,title,summary,skills,gaps,recommendation ])
  console.log("controller",result)
  res.json({ result });
}


export const analysis_db = async(req,res)=>{
    const {id} = req.params;
    try{
        const fetchAnalysisFromDb= await pool.query("SELECT * FROM weekly_analysis WHERE user_id=$1",[id])
        return res.status(200).json({message:"successfully fetched the analysis",data:fetchAnalysisFromDb.rows})
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
    const save_dashboard_analysis = await pool.query(`
        INSERT INTO dashboard_insights(user_id,focus,progress) VALUES($1,$2,$3) ON CONFLICT (user_id) DO UPDATE SET
        focus= EXCLUDED.focus,
        progress = EXCLUDED.progress`,[id,focus,progress])

    //fetching 
    const dashboard = await pool.query("SELECT * FROM dashboard_insights WHERE user_id=$1",[id])
    
      res.json({message:"dashboard analysis",data:dashboard.rows})
}