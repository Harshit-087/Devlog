import {axiosInstance} from "./axiosInstance"

export const journalQuery={
    createJournal:async(payload:{title:string,content:string,})=>{
        return await axiosInstance.post("/journal-api/create",payload)
    }
}