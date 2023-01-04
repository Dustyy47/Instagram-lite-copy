import { addPost, getPosts, getProfileOwnerInfo } from '../../http/userApi'
import { LoadingStatuses } from '../../models/LoadingStatuses'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const fetchProfileData = createAsyncThunk(
    'profile/getData',
    async (pathProfileId, { rejectWithValue }) => {
        const profileOwnerInfo = await getProfileOwnerInfo(pathProfileId)
        if (!profileOwnerInfo) {
            return rejectWithValue(404)
        }
        const posts = await getPosts(profileOwnerInfo.id)
        document.title = profileOwnerInfo.fullName
        return {
            profileOwnerInfo,
            posts,
        }
    }
)

export const fetchAddPost = createAsyncThunk('profile/addPost', async (postData) => {
    return await addPost(postData)
})

const initialState = {
    loadingStatus: LoadingStatuses.loading,
    profileOwnerInfo: {},
    posts: [],
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchProfileData.fulfilled]: (state, action) => {
            const { profileOwnerInfo, posts } = action.payload
            state.loadingStatus = LoadingStatuses.idle
            state.profileOwnerInfo = profileOwnerInfo
            state.posts = posts
        },
        [fetchProfileData.rejected]: (state) => {
            state.loadingStatus = LoadingStatuses.error
        },
        [fetchProfileData.pending]: (state) => {
            state.loadingStatus = LoadingStatuses.loading
        },
        [fetchAddPost.fulfilled]: (state, action) => {
            const post = action.payload
            state.posts.push(post)
        },
    },
})

export const profileSliceReducer = profileSlice.reducer
