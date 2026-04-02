import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./router"

export default configureStore({
  reducer: {
    userReducer
  }
})