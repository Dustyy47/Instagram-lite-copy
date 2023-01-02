import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { extendedPostSliceReducer } from './slices/extendedPostSlice'
import { profileSliceReducer } from './slices/profileSlice'
import { userSliceReducer } from './slices/userSlice'

const rootReducer = combineReducers({
    user: userSliceReducer,
    extendedPost: extendedPostSliceReducer,
    profile: profileSliceReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})
