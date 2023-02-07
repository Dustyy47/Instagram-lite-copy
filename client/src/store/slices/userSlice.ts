import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resetState } from '../../helpers/resetState'
import { likePost } from '../../http/postsApi'
import { getUserInfo, subscribe } from '../../http/profileApi'
import { LoadingStatus } from '../../models/LoadingStatus'
import { State } from '../../models/State'

export const fetchUserData = createAsyncThunk('user/getData', async () => {
    console.log('get user info')
    return await getUserInfo()
})

export const fetchLikePost = createAsyncThunk('user/likePost', async (postId: string) => {
    await likePost(postId)
    return postId
})

export const fetchSubscribe = createAsyncThunk('user/subscribe', async (profileId: string) => {
    const wasSubscribed = await subscribe(profileId)
    return {
        wasSubscribed,
        profileId,
    }
})

interface UserState extends State {
    isGuest: boolean
    userId: string
    entranceLoadingStatus: LoadingStatus
    likedPosts: string[]
    subscribes: string[]
    avatarUrl: string
    nickName: string
    fullName: string
}

const initialState: UserState = {
    isGuest: true,
    userId: '',
    entranceLoadingStatus: LoadingStatus.loading,
    likedPosts: [],
    subscribes: [],
    avatarUrl: '',
    nickName: '',
    fullName: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            resetState(state, initialState)
            state.entranceLoadingStatus = LoadingStatus.idle
        },
    },
    extraReducers: {
        [fetchUserData.fulfilled.type]: (state, action) => {
            try {
                // jwt expired or user deleted
                if (!action.payload) {
                    resetState(state, initialState)
                    state.entranceLoadingStatus = LoadingStatus.error
                    return
                }
                state.entranceLoadingStatus = LoadingStatus.idle
                const { likedPosts, nickName, subscribes, avatarUrl, fullName, userId } = action.payload
                state.likedPosts = likedPosts
                state.nickName = nickName
                state.userId = userId
                state.subscribes = subscribes
                state.avatarUrl = avatarUrl
                state.fullName = fullName
                state.isGuest = false
            } catch (e) {
                state.entranceLoadingStatus = LoadingStatus.error
            }
        },
        [fetchLikePost.fulfilled.type]: (state, action) => {
            let postIndex = state.likedPosts.indexOf(action.payload)
            if (postIndex === -1) {
                state.likedPosts.push(action.payload)
            } else {
                state.likedPosts.splice(postIndex, 1)
            }
        },
        [fetchSubscribe.fulfilled.type]: (state, action) => {
            const { wasSubscribed, profileId } = action.payload
            if (wasSubscribed) {
                state.subscribes = state.subscribes.filter((id) => id !== profileId)
            } else {
                state.subscribes.push(profileId)
            }
        },
    },
})

export const userSliceReducer = userSlice.reducer
export const userActions = { ...userSlice.actions }
