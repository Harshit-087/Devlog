import {redis} from "../../config/connection.js"


export const setCache = async(key,data,ttl)=>{
    return await  redis.set(key,JSON.stringify(data),"EX",ttl);
}

export const getCache = async(key)=>{
    const data = await redis.get(key);
    return data? JSON.parse(data):null;
}