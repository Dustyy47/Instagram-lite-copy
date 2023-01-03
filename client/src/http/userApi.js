import jwtDecode from 'jwt-decode'
import { $authHost, $host } from './index'

export const login = async (email, password) => {
    try {
        const { data } = await $host.post('/auth/login', { email, password })
        localStorage.setItem('token', data)
        return jwtDecode(data)
    } catch (e) {
        console.log(e)
        throw new Error(e?.response?.data?.message)
    }
}

export const registration = async (inputData) => {
    try {
        const { data } = await $host.post('/auth/registration', inputData)
        localStorage.setItem('token', data)
        return jwtDecode(data)
    } catch (e) {
        console.log(e)
        const errors = e?.response?.data
        let errorMessage = ''
        if (Array.isArray(errors)) {
            errors.forEach((error) => (errorMessage += error.message))
        } else errorMessage = errors.message
        throw new Error(errorMessage)
    }
}

/** returns true if after operation user have subscribed , false if unscribed**/
export const subscribe = async (id) => {
    try {
        const { data } = await $authHost.put(`/profile/${id}/subscribe`)
        return data.wasSubscribed
    } catch (e) {
        console.log(e.request.response)
    }
}

export const getProfileOwnerInfo = async (id) => {
    try {
        const { data } = await $authHost.get(`/profile/${id}`)
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const getPosts = async (id) => {
    try {
        const { data } = await $authHost.get(`/profile/${id}/posts`)
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await $authHost.get('/profile/me')
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const addPost = async (data) => {
    try {
        await $authHost.post('/profile/posts', data)
    } catch (e) {
        console.log(e.request.response)
    }
}

export const likePost = async (postId) => {
    try {
        await $authHost.put(`/profile/posts/${postId}/like`)
    } catch (e) {
        console.log(e.request.response)
    }
}

export const searchUsers = async (nickname, limit, skip) => {
    try {
        const { data } = await $host.get(
            `/profile/find/${nickname}` +
                (limit ? `?limit=${limit}` : '') +
                (skip ? `&skip=${skip}` : '')
        )
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const getConversations = async () => {
    try {
        const { data } = await $authHost.get('/chat')
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const sendComment = async (text, postId) => {
    try {
        const { data } = await $authHost.put(`/profile/posts/${postId}/comment`, { text })
        return data
    } catch (e) {
        console.log(e.request.response)
    }
}

export const getComments = async (postId) => {
    try {
        const { data: comment } = await $authHost.get(`/profile/posts/${postId}/comments`)
        return comment
    } catch (e) {
        console.log(e.request.response)
    }
}
