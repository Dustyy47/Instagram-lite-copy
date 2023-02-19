import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addPost, deletePost } from '../../http/postsApi'
import { getPosts, getProfileOwnerInfo } from '../../http/profileApi'
import { FetchProfileReturn } from '../../models/Http'
import { Status } from '../../models/LoadingStatus'
import { State } from '../../models/State'
import { PostModel } from './../../models/PostModel'
import { ProfileOwnerModel } from './../../models/ProfileOwnerModel'

export const fetchProfileData = createAsyncThunk<FetchProfileReturn, string, { rejectValue: number }>(
    'profile/getData',
    async (pathProfileId: string, { rejectWithValue }) => {
        const profileOwnerInfo = await getProfileOwnerInfo(pathProfileId)
        if (!profileOwnerInfo) {
            return rejectWithValue(404)
        }
        const posts = await getPosts(profileOwnerInfo._id || '')
        document.title = profileOwnerInfo.fullName || ''
        return {
            profileOwnerInfo,
            posts,
        }
    }
)

export const fetchDeletePost = createAsyncThunk('profile/deletePost', async (postId: string) => {
    await deletePost(postId)
    return { _id: postId }
})

export const fetchAddPost = createAsyncThunk('profile/addPost', async (postData: FormData) => {
    return await addPost(postData)
})

interface ProfileState extends State {
    loadingStatus: Status
    profileOwnerInfo: ProfileOwnerModel | {}
    posts: PostModel[]
}

const initialState: ProfileState = {
    loadingStatus: Status.loading,
    profileOwnerInfo: {},
    posts: [],
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchProfileData.fulfilled.type]: (state, action) => {
            const { profileOwnerInfo, posts } = action.payload
            state.loadingStatus = Status.idle
            state.profileOwnerInfo = profileOwnerInfo
            state.posts = posts
        },
        [fetchProfileData.rejected.type]: (state) => {
            state.loadingStatus = Status.error
        },
        [fetchProfileData.pending.type]: (state) => {
            state.loadingStatus = Status.loading
        },
        [fetchAddPost.fulfilled.type]: (state, action) => {
            const post = action.payload
            state.posts.push(post)
        },
        [fetchDeletePost.fulfilled.type]: (state, action) => {
            state.posts = [...state.posts.filter((post) => post._id !== action.payload._id)]
        },
    },
})

export const profileSliceReducer = profileSlice.reducer
