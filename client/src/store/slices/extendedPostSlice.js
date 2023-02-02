import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getComments, sendComment } from '../../http/postsApi'
import { LoadingStatus } from '../../models/LoadingStatus'

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
    loadingStatus: LoadingStatus.loading,
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
            state.postLoadingStatus = LoadingStatus.idle
        },
        [fetchSendComment.pending]: (state) => {
            state.postLoadingStatus = LoadingStatus.loading
        },
        [fetchGetComments.fulfilled]: (state, action) => {
            const { comments, postId } = action.payload
            state.comments = comments
            state.postId = postId
            state.postLoadingStatus = LoadingStatus.idle
        },
        [fetchGetComments.pending]: (state) => {
            state.postLoadingStatus = LoadingStatus.loading
        },
    },
})

export const extendedPostSliceReducer = extendedPostSlice.reducer
export const extendedPostActions = {
    ...extendedPostSlice.actions,
    fetchGetComments,
    fetchSendComment,
}
