import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getComments, sendComment } from '../../http/postsApi'
import { CommentModel } from '../../models/CommentModel'
import { LoadingStatus } from '../../models/LoadingStatus'
import { State } from '../../models/State'
import { RootState } from './../index'

export const fetchSendComment = createAsyncThunk<
    CommentModel | undefined,
    undefined,
    { state: RootState }
>('comments/test', async (_, { getState }) => {
    const { commentText, postId } = getState().extendedPost
    const newComment = await sendComment(commentText, postId)
    return newComment
})

export const fetchGetComments = createAsyncThunk('comments/getComments', async (postId: string) => {
    const comments = await getComments(postId)
    return {
        comments,
        postId,
    }
})

interface ExtendedPostState extends State {
    comments: CommentModel[]
    commentText: string
    postId: string
    postLoadingStatus: LoadingStatus
}

const initialState: ExtendedPostState = {
    comments: [],
    commentText: '',
    postId: '',
    postLoadingStatus: LoadingStatus.loading,
}

const extendedPostSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        open(state, action) {
            state.postId = action.payload
        },
        setCommentText(state, action) {
            state.commentText = action.payload
        },
    },

    extraReducers(builder) {
        builder
            .addCase(fetchSendComment.fulfilled, (state, action) => {
                state.commentText = ''
                state.comments.push(action.payload as CommentModel)
                state.postLoadingStatus = LoadingStatus.idle
            })
            .addCase(fetchSendComment.pending, (state, action) => {
                state.postLoadingStatus = LoadingStatus.loading
            })
            .addCase(fetchGetComments.fulfilled, (state, action) => {
                const { comments, postId } = action.payload
                state.comments = comments
                state.postId = postId
                state.postLoadingStatus = LoadingStatus.idle
            })
            .addCase(fetchGetComments.pending, (state, action) => {
                state.postLoadingStatus = LoadingStatus.loading
            })
    },
})

export const extendedPostSliceReducer = extendedPostSlice.reducer
export const extendedPostActions = {
    ...extendedPostSlice.actions,
    fetchGetComments,
    fetchSendComment,
}
