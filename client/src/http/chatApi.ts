import { AxiosError } from 'axios'
import { $authHost } from '.'

export const getConversations = async () => {
    try {
        const { data } = await $authHost.get('/conversations')
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}

export interface CreateConversationRequestBody {
    secondUserID: number
}

export const createConversation = async (requestBody: CreateConversationRequestBody) => {
    try {
        const { data } = await $authHost.post<number>('/conversations/create', requestBody)
        console.log(data)
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
        return undefined
    }
}
