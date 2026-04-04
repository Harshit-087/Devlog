import {axiosInstance} from "./axiosInstance"

export const journalQuery={
    createJournal:async(payload:{title:string,content:string},id:string)=>{
        return await axiosInstance.post(`/journal-api/v1/create/${id}`,payload)
    },
     fetchJournal:async(id:string)=>{
        console.log("going to backend",id)
        return await axiosInstance.get(`/journal-api/v1/journal/${id}`)
    },
    
}

// 