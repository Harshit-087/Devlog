import {axiosInstance} from "./axiosInstance"
import axios from "axios"


export const userQuery={
  signupUser:async(payload:{name:string,email:string,password:string})=>{
    return await axiosInstance.post("/user-api/v1/signup",payload)
  },
  signinUser:async(payload:{email:string,password:string})=>{
      
    return await  axios.post("/api/auth/signin",payload)
  },
  signoutUser: async () => {
    
    return await axios.post(`/api/auth/signout`)
  },
  googleSignin:async(payload:{name:string,email:string})=>{
    
    return await axios.post(`/api/auth/google-signin`,payload)
  }
  
}