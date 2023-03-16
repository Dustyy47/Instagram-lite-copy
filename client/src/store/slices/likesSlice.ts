import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { likeComment, likePost } from 'http/postsApi'

const fetchLikePost = createAsyncThunk<LikesMeta, number, { rejectValue: number }>(
    'likes/likePost',
    async (postId, { rejectWithValue }) => {
        const response = await likePost(postId)
        if (!response) return rejectWithValue(400)
        return { id: postId, isActiveUserLiked: response.isActiveUserLiked, numLikes: response.numLikes }
    }
)

const fetchLikeComment = createAsyncThunk<LikesMeta, { postID: number; commentID: number }, { rejectValue: number }>(
    'likes/likeComment',
    async ({ postID, commentID }, { rejectWithValue }) => {
        const response = await likeComment(postID, commentID)
        if (!response) return rejectWithValue(400)
        return { id: commentID, isActiveUserLiked: response.isActiveUserLiked, numLikes: response.numLikes }
    }
)

export interface LikesMeta {
    id: number
    isActiveUserLiked: boolean
    numLikes: number
}

export type LikeTarget = 'comment' | 'post'
type TargetLikesRecord = Record<number, LikesMeta>
type GlobalLikesRecord = Record<LikeTarget, TargetLikesRecord>

interface LikesState {
    likes: GlobalLikesRecord
}

const initialState: LikesState = {
    likes: { comment: {}, post: {} },
}

export const likesSlice = createSlice({
    name: 'likes',
    initialState,
    reducers: {
        addLikesMeta(state, action: PayloadAction<{ type: LikeTarget; likesMeta: LikesMeta }>) {
            const { type, likesMeta } = action.payload
            state.likes[type][likesMeta.id] = likesMeta
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLikePost.fulfilled, (state, action) => {
            const { id } = action.payload
            state.likes['post'][id] = action.payload
        })
        builder.addCase(fetchLikeComment.fulfilled, (state, action) => {
            const { id } = action.payload
            state.likes['comment'][id] = action.payload
        })
    },
})

export const likesReducer = likesSlice.reducer
export const likesActions = { ...likesSlice.actions, likePost: fetchLikePost, likeComment: fetchLikeComment }
