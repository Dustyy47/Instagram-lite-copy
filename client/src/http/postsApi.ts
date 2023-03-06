import { AxiosError } from 'axios'
import { PostModel } from 'models/PostModel'
import { LikesMeta } from 'store/slices/likesSlice'
import { $authHost } from '.'
import { CommentModel } from './../models/CommentModel'
import { WithLikes } from './../models/Generics'

export const addPost = async (formData: FormData) => {
    try {
        const { data } = await $authHost.post<PostModel>('/posts/create', formData)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export type LikeResponse = Omit<LikesMeta, 'id'>

export const likePost = async (postId: number) => {
    try {
        const { data } = await $authHost.put<LikeResponse>(`/posts/${postId}/like`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const likeComment = async (postID: number, commentID: number) => {
    try {
        const { data } = await $authHost.put<LikeResponse>(`/posts/${postID}/comments/${commentID}/like`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const deletePost = async (postId: number) => {
    try {
        await $authHost.delete(`posts/${postId}`)
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const sendComment = async (text: string, postId: number) => {
    try {
        const { data } = await $authHost.post<Omit<CommentModel, 'author'>>(`/posts/${postId}/comments/create`, {
            text,
        })
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

interface GetPostsRequestQuery {
    userID: number
    limit?: number
    offset?: number
}

interface GetPostResponse extends WithLikes<PostModel> {
    post: PostModel
}

export const getPosts = async ({ limit = 12, offset = 0, userID }: GetPostsRequestQuery) => {
    try {
        const { data } = await $authHost.get<{ postsWithLikes: GetPostResponse[] }>(`/posts/userID/${userID}`, {
            params: { limit, offset },
        })
        return data.postsWithLikes.map((post) => {
            post.data = post.post
            return post
        })
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

interface GetCommentResponse extends WithLikes<CommentModel> {
    comment: CommentModel
}

export const getComments = async (postId: number) => {
    try {
        const { data } = await $authHost.get<{ commentWithLikes: GetCommentResponse[] }>(`/posts/${postId}/comments`, {
            params: { limit: 10, offset: 0 },
        })
        const comments = data.commentWithLikes.map((comment) => {
            comment.data = { ...comment.comment }
            return comment
        })
        return comments as WithLikes<CommentModel>[]
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}
