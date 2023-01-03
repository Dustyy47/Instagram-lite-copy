import { getPosts, getProfileOwnerInfo } from '../../http/userApi'
import { LoadingStatuses } from '../../models/LoadingStatuses'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const fetchProfileData = createAsyncThunk(
    'profile/fetchData',
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
    },
})

export const profileSliceReducer = profileSlice.reducer
export const {} = profileSlice.actions
