import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resetState } from '../../helpers/resetState'
import { getUserInfo } from '../../http/profileApi'
import { Status } from '../../models/LoadingStatus'
import { ProfileModel } from '../../models/ProfileOwnerModel'
import { State } from '../../models/State'

const fetchUserData = createAsyncThunk<ProfileModel, undefined, { rejectValue: number }>(
    'user/getData',
    async (_, { rejectWithValue }) => {
        const response = await getUserInfo()
        if (!response) {
            return rejectWithValue(404)
        }
        return response
    }
)

interface UserState extends State {
    profile: ProfileModel | null
    isGuest: boolean
    entranceLoadingStatus: Status
}

const initialState: UserState = {
    profile: null,
    isGuest: true,
    entranceLoadingStatus: Status.loading,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            resetState(state, initialState)
            state.entranceLoadingStatus = Status.idle
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.entranceLoadingStatus = Status.idle
                state.profile = action.payload
                state.isGuest = false
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.entranceLoadingStatus = Status.error
            })
        // .addCase(fetchSubscribe.fulfilled,(state,action)=>{
        //     const { wasSubscribed, profileId } = action.payload
        //     if (wasSubscribed) {
        //         state.subscribes = state.subscribes.filter((id) => id !== profileId)
        //     } else {
        //         state.subscribes.push(profileId)
        //     }
        // })
    },
})

export const userSliceReducer = userSlice.reducer
export const userActions = { ...userSlice.actions, getData: fetchUserData }
