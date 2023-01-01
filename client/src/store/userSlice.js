import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUserInfo, likePost } from '../http/userApi'
import { LoadingStatuses } from '../models/LoadingStatuses'
import { resetState } from '../utils/resetState'

export const fetchUserData = createAsyncThunk('user/fetchData', async () => {
    console.log('get user info')
    return await getUserInfo()
})

export const fetchLikePost = createAsyncThunk('user/likePost', async (postId) => {
    await likePost(postId)
    return postId
})

const initialState = {
    isGuest: true,
    userId: null,
    entranceLoadingStatus: LoadingStatuses.loading,
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
            state.entranceLoadingStatus = LoadingStatuses.idle
        },
    },
    extraReducers: {
        [fetchUserData.fulfilled]: (state, action) => {
            try {
                // jwt expired or user deleted
                if (!action.payload) {
                    resetState(state, initialState)
                    state.entranceLoadingStatus = 'error'
                    return
                }
                state.entranceLoadingStatus = LoadingStatuses.idle
                const { likedPosts, nickName, subscribes, avatarUrl, fullName, userId } =
                    action.payload
                state.likedPosts = likedPosts
                state.nickName = nickName
                state.userId = userId
                state.subscribes = subscribes
                state.avatarUrl = avatarUrl
                state.fullName = fullName
                state.isGuest = false
            } catch (e) {
                state.entranceLoadingStatus = 'error'
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
