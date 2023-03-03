import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { resetState } from '../../helpers/resetState'
import { getUserInfo } from '../../http/profileApi'
import { Status } from '../../models/LoadingStatus'
import { State } from '../../models/State'
import { subscribe } from './../../http/profileApi'
import { ProfileOwnerModel } from './../../models/ProfileOwnerModel'

export const fetchUserData = createAsyncThunk<ProfileOwnerModel, undefined, { rejectValue: number }>(
    'user/getData',
    async (_, { rejectWithValue }) => {
        const response = await getUserInfo()
        if (!response) {
            return rejectWithValue(404)
        }
        return response
    }
)

export const fetchSubscribe = createAsyncThunk('user/subscribe', async (profileId: number) => {
    const wasSubscribed = await subscribe(profileId.toString())
    return {
        wasSubscribed,
        profileId,
    }
})

interface UserState extends State {
    userProfile: ProfileOwnerModel | null
    isGuest: boolean
    entranceLoadingStatus: Status
}

const initialState: UserState = {
    userProfile: null,
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
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            try {
                // jwt expired or user deleted
                state.entranceLoadingStatus = Status.idle
                state.userProfile = action.payload
                state.isGuest = false
            } catch (e) {
                state.entranceLoadingStatus = Status.error
            }
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
export const userActions = { ...userSlice.actions }
