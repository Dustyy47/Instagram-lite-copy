import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { wrapToWithLike } from 'helpers/wrapToWithLikes'
import { WithLikes } from 'models/Generics'
import { getComments } from '../../http/postsApi'
import { getProfileInfo } from '../../http/profileApi'
import { sendComment } from './../../http/postsApi'
import { CommentModel } from './../../models/CommentModel'
import { Status } from './../../models/LoadingStatus'
import { PostModel } from './../../models/PostModel'
import { UserModel } from './../../models/ProfileOwnerModel'
import { AppDispatch, RootState } from './../index'

export const fetchOpenPost = createAsyncThunk<
    WithLikes<CommentModel>[],
    WithLikes<PostModel>,
    { dispatch: AppDispatch; rejectValue: number; state: RootState }
>('extendedPost/open', async (post, { dispatch, rejectWithValue, getState }) => {
    const authorProfile = await getProfileInfo({ userID: post.data.user_id })
    if (!authorProfile) return rejectWithValue(404)
    const isActiveUserPost = getState().user.profile?.owner.userID === post.data.user_id
    dispatch(extendedPostActions.setPost({ post, author: authorProfile.owner, isActiveUserPost }))
    const comments = await getComments(post.data.id)
    if (!comments) return rejectWithValue(404)
    return comments
})

export const fetchSendComment = createAsyncThunk<CommentModel, string, { state: RootState; rejectValue: number }>(
    'extendedPost/send',
    async (comment, { getState, rejectWithValue }) => {
        const responseComment = await sendComment(comment, getState().extendedPost.post?.data.id || 0)
        if (!responseComment) return rejectWithValue(400)
        const newComment: CommentModel = { ...responseComment, author: getState().user.profile?.owner as UserModel }
        return newComment
    }
)

type PostAuthor = Pick<UserModel, 'avatarUrl' | 'nickname'>

interface ExtendedPostState {
    comments: WithLikes<CommentModel>[]
    commentsStatus: Status
    post: WithLikes<PostModel> | null
    isActiveUserPost: boolean
    author: PostAuthor | null
    isOpen: boolean
}

const initialState: ExtendedPostState = {
    isOpen: false,
    isActiveUserPost: false,
    commentsStatus: Status.loading,
    comments: [],
    author: null,
    post: null,
}

const extendedPostSlice = createSlice({
    name: 'extendedPost',
    initialState,
    reducers: {
        toggle(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload
        },
        setPost(state, action: PayloadAction<{ post: WithLikes<PostModel>; author: PostAuthor; isActiveUserPost: boolean }>) {
            state.post = action.payload.post
            state.author = action.payload.author
            state.isActiveUserPost = action.payload.isActiveUserPost
        },
        reset(state) {
            state.isOpen = false
            state.author = null
            state.post = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOpenPost.fulfilled, (state, action) => {
                state.comments = action.payload
                state.isOpen = true
                state.commentsStatus = Status.idle
            })
            .addCase(fetchOpenPost.pending, (state) => {
                state.isOpen = true
                state.commentsStatus = Status.loading
            })
            .addCase(fetchSendComment.fulfilled, (state, action) => {
                state.comments.push(wrapToWithLike<CommentModel>(action.payload))
                state.commentsStatus = Status.idle
            })
            .addCase(fetchSendComment.pending, (state) => {
                state.commentsStatus = Status.loading
            })
    },
})

export const extendedPostSliceReducer = extendedPostSlice.reducer
export const extendedPostActions = extendedPostSlice.actions
