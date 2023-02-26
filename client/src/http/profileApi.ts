import { AxiosError } from 'axios'
import { $authHost, $host } from '.'
import { ProfileOwnerModel } from './../models/ProfileOwnerModel'

const PROFILE_URL = '/profiles/'

export const subscribe = async (id: string) => {
    try {
        const { data } = await $authHost.put(`${PROFILE_URL + id}/subscribe`)
        return data.wasSubscribed
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const getProfileOwnerInfo = async (id: string) => {
    try {
        const { data } = await $authHost.get<ProfileOwnerModel>(`${PROFILE_URL + id}`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getPosts = async (id: string) => {
    try {
        const { data } = await $authHost.get(`${PROFILE_URL + id}/posts`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await $authHost.get(`${PROFILE_URL}me`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export const searchUsers = async (nickname: string, limit: number, skip: number) => {
    try {
        const { data } = await $host.get(
            `${PROFILE_URL}find/${nickname}` + (limit ? `?limit=${limit}` : '') + (skip ? `&skip=${skip}` : '')
        )
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}
