import {createSlice} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const userSlice = createSlice({
    name : "user",
    initialState:{
        userId:null,
        isLoading:true,
        likedPosts:[],
        subscribes:null,
        nickName:"",
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
        },
        setInfo(state,action){
            const {likedPosts,nickName,subscribes} = action.payload;
            state.likedPosts = likedPosts;
            state.nickName = nickName;
            state.subscribes = subscribes;
        }
    }
})

export default userSlice.reducer;
export const {setId,setLoading,setInfo} = userSlice.actions;