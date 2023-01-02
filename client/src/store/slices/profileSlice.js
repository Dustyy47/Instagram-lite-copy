import { getPosts, getProfileInfo } from '../../http/userApi'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { getIsUserSubscribed } from '../../utils/isUserSubscribed'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const fetchProfileData = createAsyncThunk(
    'profile/fetchData',
    async (pathProfileId, { rejectWithValue, getState }) => {
        const profileInfo = await getProfileInfo(pathProfileId)
        if (!profileInfo) {
            return rejectWithValue(404)
        }
        const posts = await getPosts(profileInfo.profileId)
        document.title = profileInfo.fullName
        const { subscribes, isGuest } = getState().user
        const isUserSubscribed = getIsUserSubscribed(subscribes, isGuest, profileInfo.profileId)
        return {
            profileInfo,
            posts,
            isUserSubscribed,
        }
    }
)

const initialState = {
    loadingStatus: LoadingStatuses.loading,
    profileInfo: {},
    posts: [],
    isUserSubscribed: false,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchProfileData.fulfilled]: (state, action) => {
            const { profileInfo, posts, isUserSubscribed } = action.payload
            state.loadingStatus = LoadingStatuses.idle
            state.profileInfo = profileInfo
            state.posts = posts
            state.isUserSubscribed = isUserSubscribed
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
