import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getComments } from '../../http/postsApi'
import { getProfileOwnerInfo } from '../../http/profileApi'
import { FetchLoadExtendedPostReturn } from '../../models/Http'
import { sendComment } from './../../http/postsApi'
import { CommentModel } from './../../models/CommentModel'
import { Status } from './../../models/LoadingStatus'
import { PostModel } from './../../models/PostModel'
import { ProfileOwnerModel } from './../../models/ProfileOwnerModel'
import { AppDispatch, RootState } from './../index'

export const fetchOpenPost = createAsyncThunk<FetchLoadExtendedPostReturn, PostModel, { dispatch: AppDispatch }>(
    'extendedPost/open',
    async (post, { dispatch }) => {
        dispatch(extendedPostActions.setPost(post))
        const comments = await getComments(post._id)
        const author = (await getProfileOwnerInfo(post.postedBy)) as ProfileOwnerModel
        return {
            comments,
            author,
        }
    }
)

export const fetchSendComment = createAsyncThunk<CommentModel, string, { state: RootState }>(
    'extendedPost/send',
    async (comment, { getState }) => {
        const newComment = (await sendComment(comment, getState().extendedPost.post._id)) as CommentModel
        return newComment
    }
)

interface ExtendedPostState {
    comments: CommentModel[]
    commentsStatus: Status
    post: PostModel
    author: Pick<ProfileOwnerModel, 'avatarUrl' | 'nickName'>
    isOpen: boolean
}

const initialState: ExtendedPostState = {
    isOpen: false,
    commentsStatus: Status.loading,
    comments: [],
    author: {},
    post: { _id: '', imageUrl: '', title: '', description: '', likes: [], postedBy: '' },
}

const extendedPostSlice = createSlice({
    name: 'extendedPost',
    initialState,
    reducers: {
        toggle(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload
        },
        setPost(state, action: PayloadAction<PostModel>) {
            state.post = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOpenPost.fulfilled, (state, action) => {
                const { comments, author } = action.payload
                state.author = author
                state.comments = comments
                state.isOpen = true
                state.commentsStatus = Status.idle
            })
            .addCase(fetchOpenPost.pending, (state) => {
                state.isOpen = true
                state.commentsStatus = Status.loading
            })
            .addCase(fetchSendComment.fulfilled, (state, action) => {
                state.comments.push(action.payload)
                state.commentsStatus = Status.idle
            })
            .addCase(fetchSendComment.pending, (state) => {
                state.commentsStatus = Status.loading
            })
    },
})

export const extendedPostSliceReducer = extendedPostSlice.reducer
export const extendedPostActions = extendedPostSlice.actions
