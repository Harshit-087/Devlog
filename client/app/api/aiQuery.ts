import {axiosInstance} from "./axiosInstance"


export const aiQuery={
  AIsummary:async(id:string,days:number)=>{
        console.log("going to backend",id,typeof(days))
        return await axiosInstance.get(`/ai-api/v1/summary/${id}`,{params:{days}})
    },
    fetchAIResponse:async(id:string)=>{
        console.log("going to backend",id)
        return await axiosInstance.get(`/ai-api/v1/analysis/${id}`)
    },
    fetchDashboardAnalysis : async(id:string,)=>{
        console.log("going to :",id)
        return await axiosInstance.get(`/ai-api/v1/dashboard/${id}`)
    }
}