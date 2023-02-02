import { AxiosError } from 'axios'
import { $authHost, $host } from '.'

export const subscribe = async (id: string) => {
    try {
        const { data } = await $authHost.put(`/profile/${id}/subscribe`)
        return data.wasSubscribed
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const getProfileOwnerInfo = async (id: string) => {
    try {
        const { data } = await $authHost.get(`/profile/${id}`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const getPosts = async (id: string) => {
    try {
        const { data } = await $authHost.get(`/profile/${id}/posts`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await $authHost.get('/profile/me')
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const searchUsers = async (nickname: string, limit: number, skip: number) => {
    try {
        const { data } = await $host.get(
            `/profile/find/${nickname}` +
                (limit ? `?limit=${limit}` : '') +
                (skip ? `&skip=${skip}` : '')
        )
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}
