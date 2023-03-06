import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { wrapToWithLike } from 'helpers/wrapToWithLikes'
import { WithLikes } from 'models/Generics'
import { addPost, deletePost } from '../../http/postsApi'
import { follow, getProfileInfo, GetProfileInfoRequestParams, SubscribeResponse } from '../../http/profileApi'
import { Status } from '../../models/LoadingStatus'
import { State } from '../../models/State'
import { getPosts } from './../../http/postsApi'
import { PostModel } from './../../models/PostModel'
import { ProfileModel } from './../../models/ProfileOwnerModel'
import { AppDispatch } from './../index'

export const fetchProfile = createAsyncThunk<
    WithLikes<PostModel>[],
    GetProfileInfoRequestParams,
    { rejectValue: number; dispatch: AppDispatch }
>('profile/getData', async (requestPathParams, { rejectWithValue, dispatch }) => {
    const profileOwnerInfo: ProfileModel | undefined = await getProfileInfo(requestPathParams)
    if (!profileOwnerInfo) {
        return rejectWithValue(404)
    }
    dispatch(profileActions.setProfileOwnerInfo(profileOwnerInfo))
    const posts: WithLikes<PostModel>[] | undefined = await getPosts({ userID: profileOwnerInfo.owner.userID })
    if (!posts) {
        return rejectWithValue(404)
    }
    document.title = profileOwnerInfo.owner.fullname
    return posts
})

export const fetchDeletePost = createAsyncThunk('profile/deletePost', async (postId: number) => {
    await deletePost(postId)
    const payload: Pick<PostModel, 'id'> = { id: postId }
    return payload
})

export const fetchAddPost = createAsyncThunk<PostModel, FormData, { rejectValue: number }>(
    'profile/addPost',
    async (postData, { rejectWithValue }) => {
        const newPost = await addPost(postData)
        if (!newPost) return rejectWithValue(400)
        return newPost
    }
)

export const fetchFollow = createAsyncThunk<SubscribeResponse, number, { rejectValue: number }>(
    'profile/follow',
    async (profileId, { rejectWithValue }) => {
        const data = await follow(profileId)
        if (!data) return rejectWithValue(400)
        return data
    }
)

interface ProfileState extends State {
    loadingStatus: Status
    usersListStatus: Status
    profileInfo: ProfileModel | null
    posts: WithLikes<PostModel>[]
}

const initialState: ProfileState = {
    loadingStatus: Status.loading,
    usersListStatus: Status.loading,
    profileInfo: null,
    posts: [],
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileOwnerInfo(state, action: PayloadAction<ProfileModel>) {
            state.profileInfo = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loadingStatus = Status.idle
                state.posts = action.payload
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.loadingStatus = Status.error
            })
            .addCase(fetchProfile.pending, (state) => {
                state.loadingStatus = Status.loading
            })

            .addCase(fetchAddPost.fulfilled, (state, action) => {
                const post = wrapToWithLike<PostModel>(action.payload)
                state.posts.push(post)
            })
            .addCase(fetchDeletePost.fulfilled, (state, action) => {
                state.posts = [...state.posts.filter((post) => post.data.id !== action.payload.id)]
            })
            .addCase(fetchFollow.fulfilled, (state, action) => {
                const { numFollowers, isActiveUserFollowing } = action.payload
                if (state.profileInfo)
                    state.profileInfo = {
                        ...state.profileInfo,
                        numFollowers,
                        owner: { ...state.profileInfo.owner, isActiveUserFollowing },
                    }
            })
    },
})

export const profileSliceReducer = profileSlice.reducer
export const profileActions = profileSlice.actions
