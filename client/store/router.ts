import { createSlice,PayloadAction } from '@reduxjs/toolkit'


export interface initialState{
isLogged:boolean,
id:string
name:string,
email:string,
token:string
}

const initialState:initialState={
  isLogged:false,
  id:"",
  name:"",
  email:"",
  token:"",
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   logIn:(state,action:PayloadAction<{
    data:{
      id:string,
      name:string,
    email:string
  },
    token:string
   }>)=>{
    state.isLogged=true,
    state.id=action.payload.data?.id,
    state.name=action.payload.data?.name,
    state.email=action.payload.data?.email,
    state.token=action.payload.token
   },
   SignOut:(state)=>{
    state.isLogged=false,
    state.id="",
    state.name="",
    state.email="",
    state.token=""
   }
  }
})

// Action creators are generated for each case reducer function
export const {SignOut,logIn} = userSlice.actions

export default userSlice.reducer