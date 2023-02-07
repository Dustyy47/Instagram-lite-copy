import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { profileSliceReducer } from './slices/profileSlice'
import { userSliceReducer } from './slices/userSlice'

const rootReducer = combineReducers({
    user: userSliceReducer,
    profile: profileSliceReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
