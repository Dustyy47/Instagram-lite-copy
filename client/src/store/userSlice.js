import {createSlice} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getUserInfo} from "../http/userApi";

export const LoadingStatuses = {loading:"loading",idle:"idle",error:"error"};

export const fetchUserData = createAsyncThunk(
    'user/fetchData',
    async()=>{
        return await getUserInfo();
    }
)

const initialState = {
    isGuest:true,
    userId:null,
    entranceLoadingStatus:LoadingStatuses.idle,
    likedPosts:null,
    subscribes:null,
    avatarUrl:"",
    nickName:"",
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers: {
        setId(state){
            const token = localStorage.getItem('token');
            state.entranceLoadingStatus = LoadingStatuses.idle;
            if(!token)
            {
                for(let field in state){
                    state[field] = initialState[field];
                }
                return;
            }
            try{
               const payload = jwtDecode(token);
               if(payload){
                   state.userId = payload.userId;
               }
           }
           catch (e){
               state.entranceLoadingStatus = LoadingStatuses.error;
           }
        },
    },
    extraReducers:{
        [fetchUserData.fulfilled]: (state,action) =>{
            try{
                // jwt expired or user deleted
                if(!action.payload){
                    state.entranceLoadingStatus = "error"
                    return;
                }
                state.entranceLoadingStatus = LoadingStatuses.idle;
                const {likedPosts,nickName,subscribes,avatarUrl,fullName} = action.payload;
                state.likedPosts = likedPosts;
                state.nickName = nickName;
                state.subscribes = subscribes;
                state.avatarUrl = avatarUrl;
                state.fullName = fullName;
                state.isGuest = false;
            }
            catch(e){
                state.entranceLoadingStatus = "error"
            }
        },
        [fetchUserData.pending]: (state,action) =>{
            state.entranceLoadingStatus = LoadingStatuses.loading;
        },
    }
})

export default userSlice.reducer;
export const {setId,setInfo} = userSlice.actions;