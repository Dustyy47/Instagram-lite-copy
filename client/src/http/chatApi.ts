import { AxiosError } from 'axios'
import { $authHost } from '.'

export const getConversations = async () => {
    try {
        const { data } = await $authHost.get('/chat')
        return data
    } catch (e) {
        console.log((e as AxiosError).request.response)
    }
}
