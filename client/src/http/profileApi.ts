import { AxiosError } from 'axios'
import { ProfileModel } from 'models/ProfileOwnerModel'
import { $authHost } from '.'
import { UserModel } from '../models/ProfileOwnerModel'

export interface SubscribeResponse {
    isActiveUserFollowing: boolean
    numFollowers: number
}

export const follow = async (id: number) => {
    try {
        const { data } = await $authHost.put<SubscribeResponse>(`/profiles/id/${id}/follow`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
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
        const { data } = await $authHost.get<ProfileModel>(path)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getUserInfo = async () => {
    try {
        const { data } = await $authHost.get<ProfileModel>(`profiles/me`)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}

export const getFollowers = async (id: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserModel[] }>(`profiles/id/${id}/followers`, { params: { limit: 5 } })
        return data.users
    } catch (e) {
        return undefined
    }
}

export const getFollowings = async (id: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserModel[] }>(`profiles/id/${id}/followings`, { params: { limit: 5 } })
        return data.users
    } catch (e) {
        return undefined
    }
}

export const searchUsers = async (nickname: string, limit: number, offset: number) => {
    try {
        const { data } = await $authHost.get<{ users: UserModel[] }>(`profiles/find/${nickname}`, {
            params: { limit, offset },
        })
        return data.users
    } catch (e) {
        console.log(e as AxiosError)
        return undefined
    }
}
