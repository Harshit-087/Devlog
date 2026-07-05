import {axiosInstance} from "./axiosInstance"


export const aiQuery={
  AIsummary:async(id:string,days:number)=>{
        
        return await axiosInstance.get(`/ai-api/v1/summary/${id}`,{params:{days}})
    },
    fetchAIResponse:async(id:string)=>{
     
        return await axiosInstance.get(`/ai-api/v1/analysis/${id}`)
    },
    fetchDashboardAnalysis : async(id:string,)=>{
        
        return await axiosInstance.get(`/ai-api/v1/dashboard/${id}`)
    },
    addLearningGap:async(id:string,gap:string)=>{
        return await axiosInstance.post("/ai-api/v1/learning-gap",{userId:id,gap})
    }
}