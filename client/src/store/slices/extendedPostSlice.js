import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getComments, sendComment } from '../../http/userApi'
import { LoadingStatuses } from '../../models/LoadingStatuses'

export const fetchSendComment = createAsyncThunk(
    'comments/sendComment',
    async (_, { getState }) => {
        const { commentText, postId } = getState().extendedPost
        return sendComment(commentText, postId)
    }
)

export const fetchGetComments = createAsyncThunk('comments/getComments', async (postId) => {
    const comments = await getComments(postId)
    return {
        comments,
        postId,
    }
})

const initialState = {
    comments: [],
    commentText: '',
    postId: '',
    loadingStatus: LoadingStatuses.loading,
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
    extraReducers: {
        [fetchSendComment.fulfilled]: (state, action) => {
            state.commentText = ''
            state.comments.push(action.payload)
            state.postLoadingStatus = LoadingStatuses.idle
        },
        [fetchSendComment.pending]: (state) => {
            state.postLoadingStatus = LoadingStatuses.loading
        },
        [fetchGetComments.fulfilled]: (state, action) => {
            const { comments, postId } = action.payload
            state.comments = comments
            state.postId = postId
            state.postLoadingStatus = LoadingStatuses.idle
        },
        [fetchGetComments.pending]: (state) => {
            state.postLoadingStatus = LoadingStatuses.loading
        },
    },
})

export const extendedPostSliceReducer = extendedPostSlice.reducer
export const extendedPostActions = {
    ...extendedPostSlice.actions,
    fetchGetComments,
    fetchSendComment,
}
