import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { wrapToWithLike } from 'helpers/wrapToWithLikes'
import { WithLikes } from 'models/Generics'
import { getComments } from '../../http/postsApi'
import { getProfileInfo } from '../../http/profileApi'
import { FetchLoadExtendedPostReturn } from '../../models/Http'
import { sendComment } from './../../http/postsApi'
import { CommentModel } from './../../models/CommentModel'
import { Status } from './../../models/LoadingStatus'
import { PostModel } from './../../models/PostModel'
import { ProfileOwnerModel, UserItemModel } from './../../models/ProfileOwnerModel'
import { AppDispatch, RootState } from './../index'

export const fetchOpenPost = createAsyncThunk<
    FetchLoadExtendedPostReturn,
    WithLikes<PostModel>,
    { dispatch: AppDispatch; rejectValue: number }
>('extendedPost/open', async (post, { dispatch, rejectWithValue }) => {
    dispatch(extendedPostActions.setPost(post))
    const comments: WithLikes<CommentModel>[] | undefined = await getComments(post.data.id)
    if (!comments) return rejectWithValue(404)
    const author = (await getProfileInfo({ userID: post.data.user_id })) as ProfileOwnerModel
    return {
        comments,
        author,
    }
})

export const fetchSendComment = createAsyncThunk<CommentModel, string, { state: RootState; rejectValue: number }>(
    'extendedPost/send',
    async (comment, { getState, rejectWithValue }) => {
        const responseComment = await sendComment(comment, getState().extendedPost.post?.data.id || 0)
        if (!responseComment) return rejectWithValue(400)
        const newComment: CommentModel = { ...responseComment, author: getState().user.userProfile as UserItemModel }
        return newComment
    }
)

interface ExtendedPostState {
    comments: WithLikes<CommentModel>[]
    commentsStatus: Status
    post: WithLikes<PostModel> | null
    author: Pick<ProfileOwnerModel, 'avatarUrl' | 'nickname'> | null
    isOpen: boolean
}

const initialState: ExtendedPostState = {
    isOpen: false,
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
        setPost(state, action: PayloadAction<WithLikes<PostModel>>) {
            state.post = action.payload
        },
        reset(state) {
            state = { ...initialState }
            state.comments = [...initialState.comments]
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
