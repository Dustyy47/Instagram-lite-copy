import { AxiosError } from 'axios'
import { $authHost } from '.'
import { CommentModel } from '../models/CommentModel'

export const addPost = async (formData: FormData) => {
    try {
        const { data } = await $authHost.post('/profile/posts', formData)
        console.log(data, 'add post response')
        return data.post
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const likePost = async (postId: string) => {
    try {
        await $authHost.put(`/profile/posts/${postId}/like`)
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const sendComment = async (
    text: string,
    postId: string
): Promise<CommentModel | undefined> => {
    try {
        const { data } = await $authHost.put<CommentModel>(`/profile/posts/${postId}/comment`, {
            text,
        })
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getComments = async (postId: string) => {
    try {
        const { data: comment } = await $authHost.get(`/profile/posts/${postId}/comments`)
        return comment
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}
