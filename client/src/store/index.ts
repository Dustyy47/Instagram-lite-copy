import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { likesReducer } from './slices/likesSlice'
import { profileSliceReducer } from './slices/profileSlice'
import { selectedPostSliceReducer } from './slices/selectedPostSlice'
import { userSliceReducer } from './slices/userSlice'

const rootReducer = combineReducers({
    user: userSliceReducer,
    profile: profileSliceReducer,
    selectedPost: selectedPostSliceReducer,
    likes: likesReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
