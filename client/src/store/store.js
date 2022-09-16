import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import {chatSlice} from "./chatSlice";

const rootReducer = combineReducers({
    user:userSlice,
    chat:chatSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});
