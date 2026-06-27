import {axiosInstance} from "./axiosInstance"


export const userQuery={
  signupUser:async(payload:{name:string,email:string,password:string})=>{
    return await axiosInstance.post("/user-api/v1/signup",payload)
  },
  signinUser:async(payload:{email:string,password:string})=>{
        console.log("going to backend")
    return await  axiosInstance.post("/user-api/v1/signin",payload)
  },
  signoutUser: async () => {
    console.log("going to backend")
    return await axiosInstance.post("/user-api/v1/signout")
  },
  googleSignin:async(payload:{name:string,email:string})=>{
    return await axiosInstance.post("/user-api/v1/googleSignin",payload)
  }
}