import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { chatSlice } from './chatSlice'
import userSlice from './userSlice'

const rootReducer = combineReducers({
    user: userSlice,
    chat: chatSlice,
})

export const store = configureStore({
    reducer: rootReducer,
})
