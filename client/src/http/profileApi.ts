import { AxiosError } from 'axios'
import { ProfileOwnerModel } from 'models/ProfileOwnerModel'
import { $authHost } from '.'
import { UserItemModel } from './../models/ProfileOwnerModel'

export const subscribe = async (id: string) => {
    try {
        const { data } = await $authHost.put(`/profiles/id/${id}/follow`)
        return data.wasSubscribed
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export interface GetProfileInfoRequestParams {
    userID?: number
    nickname?: string
}

export const getProfileInfo = async ({ userID, nickname }: GetProfileInfoRequestParams) => {
    try {
        let path = '/profiles/'
        if (userID) path += `id/${userID}`
        else if (nickname) path += `nickname/${nickname}`
        else return undefined
        const { data } = await $authHost.get<ProfileOwnerModel>(path)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await $authHost.get<ProfileOwnerModel>(`profiles/me`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getFollowers = async (id: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserItemModel[] }>(`profiles/id/${id}/followers`, { params: { limit: 5 } })
        return data.users
    } catch (e) {
        return undefined
    }
}

export const getFollowings = async (id: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserItemModel[] }>(`profiles/id/${id}/followings`, { params: { limit: 5 } })
        return data.users
    } catch (e) {
        return undefined
    }
}

export const searchUsers = async (nickname: string, limit: number, offset: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserItemModel[] }>(`profiles/find/${nickname}`, {
            params: { limit, offset },
        })
        return data.users
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}
