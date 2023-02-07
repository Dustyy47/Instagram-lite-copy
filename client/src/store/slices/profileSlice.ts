import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addPost } from '../../http/postsApi'
import { getPosts, getProfileOwnerInfo } from '../../http/profileApi'
import { FetchProfileReturn } from '../../models/Http'
import { LoadingStatus } from '../../models/LoadingStatus'
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

export const fetchAddPost = createAsyncThunk('profile/addPost', async (postData: FormData) => {
    return await addPost(postData)
})

interface ProfileState extends State {
    loadingStatus: LoadingStatus
    profileOwnerInfo: ProfileOwnerModel | {}
    posts: PostModel[]
}

const initialState: ProfileState = {
    loadingStatus: LoadingStatus.loading,
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
            state.loadingStatus = LoadingStatus.idle
            state.profileOwnerInfo = profileOwnerInfo
            state.posts = posts
        },
        [fetchProfileData.rejected.type]: (state) => {
            state.loadingStatus = LoadingStatus.error
        },
        [fetchProfileData.pending.type]: (state) => {
            state.loadingStatus = LoadingStatus.loading
        },
        [fetchAddPost.fulfilled.type]: (state, action) => {
            const post = action.payload
            state.posts.push(post)
        },
    },
})

export const profileSliceReducer = profileSlice.reducer
