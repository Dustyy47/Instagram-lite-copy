import {createSlice} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const userSlice = createSlice({
    name : "user",
    initialState:{
        userId:null,
        isLoading:true,
    },
    reducers: {
        setId(state){
            const token = localStorage.getItem('token');
            if(!token)
            {
                state.userId = null;
                state.isLoading = false;
                return;
            }
            const payload = jwtDecode(token);
            if(payload){
                state.userId = payload.userId;
            }
            state.isLoading = false;
        },
        setLoading(state,action){
            state.isLoading = action.payload;
        }
    }
})

export default userSlice.reducer;
export const {setId,setLoading} = userSlice.actions;