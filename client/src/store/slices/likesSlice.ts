import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { likePost } from 'http/postsApi'

const fetchLikePost = createAsyncThunk<LikesMeta, number, { rejectValue: number }>(
    'likes/likePost',
    async (postId, { rejectWithValue }) => {
        const response = await likePost(postId)
        if (!response) return rejectWithValue(400)
        return { id: postId, isLikedMe: response.isLikedMe, numLikes: response.numLikes }
    }
)

export interface LikesMeta {
    id: number
    isLikedMe: boolean
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
    },
})

export const likesReducer = likesSlice.reducer
export const likesActions = { ...likesSlice.actions, fetchLikePost }
