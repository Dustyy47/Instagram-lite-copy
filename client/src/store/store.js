import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { extendedPostSliceReducer } from './slices/extendedPostSlice'
import { userSliceReducer } from './slices/userSlice'

const rootReducer = combineReducers({
    user: userSliceReducer,
    extendedPost: extendedPostSliceReducer,
})

export const store = configureStore({
    reducer: rootReducer,
})
