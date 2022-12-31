import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import jwtDecode from 'jwt-decode'
import { getUserInfo, likePost } from '../http/userApi'
import { LoadingStatuses } from '../models/LoadingStatuses'
import { resetState } from '../utils/resetState'

export const fetchUserData = createAsyncThunk('user/fetchData', async () => {
    return await getUserInfo()
})

export const fetchLikePost = createAsyncThunk('user/likePost', async (postId) => {
    await likePost(postId)
    return postId
})

const initialState = {
    isGuest: true,
    userId: null,
    entranceLoadingStatus: LoadingStatuses.idle,
    likedPosts: null,
    subscribes: null,
    avatarUrl: '',
    nickName: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            resetState(state, initialState)
        },
    },
    extraReducers: {
        [fetchUserData.fulfilled]: (state, action) => {
            try {
                console.log('action:', action)
                // jwt expired or user deleted
                if (!action.payload) {
                    state.entranceLoadingStatus = 'error'
                    return
                }
                state.entranceLoadingStatus = LoadingStatuses.idle
                const { likedPosts, nickName, subscribes, avatarUrl, fullName } = action.payload
                state.likedPosts = likedPosts
                state.nickName = nickName
                state.subscribes = subscribes
                state.avatarUrl = avatarUrl
                state.fullName = fullName
                state.isGuest = false
            } catch (e) {
                state.entranceLoadingStatus = 'error'
            }
        },
        [fetchUserData.pending]: (state) => {
            //try to grab token from localstorage and set userId from this, if fails , reset state
            const token = localStorage.getItem('token')
            state.entranceLoadingStatus = LoadingStatuses.idle
            if (!token) {
                resetState(state, initialState)
                return
            }
            try {
                const payload = jwtDecode(token)
                if (payload) {
                    state.userId = payload.userId
                }
            } catch (e) {
                state.entranceLoadingStatus = LoadingStatuses.error
            }
        },
        [fetchLikePost.fulfilled]: (state, action) => {
            let postIndex = state.likedPosts.indexOf(action.payload)
            if (postIndex === -1) {
                state.likedPosts.push(action.payload)
            } else {
                state.likedPosts.splice(postIndex, 1)
            }
        },
    },
})

export default userSlice.reducer
export const { setInfo, logout } = userSlice.actions
