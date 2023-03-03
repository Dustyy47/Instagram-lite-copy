import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { wrapToWithLike } from 'helpers/wrapToWithLikes'
import { WithLikes } from 'models/Generics'
import { addPost, deletePost } from '../../http/postsApi'
import { getProfileInfo, GetProfileInfoRequestParams } from '../../http/profileApi'
import { FetchProfileReturn } from '../../models/Http'
import { Status } from '../../models/LoadingStatus'
import { State } from '../../models/State'
import { getPosts } from './../../http/postsApi'
import { PostModel } from './../../models/PostModel'
import { ProfileOwnerModel } from './../../models/ProfileOwnerModel'

export const fetchProfileData = createAsyncThunk<FetchProfileReturn, GetProfileInfoRequestParams, { rejectValue: number }>(
    'profile/getData',
    async (requestPathParams, { rejectWithValue }) => {
        const profileOwnerInfo: ProfileOwnerModel | undefined = await getProfileInfo(requestPathParams)
        if (!profileOwnerInfo) {
            return rejectWithValue(404)
        }
        const posts: WithLikes<PostModel>[] | undefined = await getPosts({ userID: profileOwnerInfo.userID })
        if (!posts) {
            return rejectWithValue(404)
        }
        document.title = profileOwnerInfo.fullname
        return {
            profileOwnerInfo,
            posts,
        }
    }
)

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

interface ProfileState extends State {
    loadingStatus: Status
    usersListStatus: Status
    profileOwnerInfo: ProfileOwnerModel | null
    posts: WithLikes<PostModel>[]
}

const initialState: ProfileState = {
    loadingStatus: Status.loading,
    usersListStatus: Status.loading,
    profileOwnerInfo: null,
    posts: [],
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileData.fulfilled, (state, action) => {
                const { profileOwnerInfo, posts } = action.payload
                state.loadingStatus = Status.idle
                state.profileOwnerInfo = profileOwnerInfo
                state.posts = posts
                state.followers = []
                state.following = []
            })
            .addCase(fetchProfileData.rejected, (state) => {
                state.loadingStatus = Status.error
            })
            .addCase(fetchProfileData.pending, (state) => {
                state.loadingStatus = Status.loading
            })

            .addCase(fetchAddPost.fulfilled, (state, action) => {
                const post = wrapToWithLike<PostModel>(action.payload)
                state.posts.push(post)
            })
            .addCase(fetchDeletePost.fulfilled, (state, action) => {
                state.posts = [...state.posts.filter((post) => post.data.id !== action.payload.id)]
            })
    },
})

export const profileSliceReducer = profileSlice.reducer
