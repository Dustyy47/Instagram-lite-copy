import { AxiosError } from 'axios'
import jwtDecode from 'jwt-decode'
import { AxiosResponse } from '../models/Http'
import { $host } from './index'

interface AuthDataResponse {
    accessToken: string
}

interface AuthTokenDecoded {
    exp: number
    id: string
    nickname: string
}

export const login = async (email: string, password: string) => {
    try {
        const { data } = await $host.post<AuthDataResponse>('/auth/login', { email, password })
        localStorage.setItem('token', data.accessToken)
        return jwtDecode<AuthTokenDecoded>(data.accessToken)
    } catch (e) {
        console.log(e)
        throw new Error((e as AxiosError<AxiosResponse>)?.response?.data?.message)
    }
}

export const registration = async (inputData: FormData) => {
    try {
        const { data } = await $host.post<AuthDataResponse>('/auth/registration', inputData)
        localStorage.setItem('token', data.accessToken)
        return jwtDecode<AuthTokenDecoded>(data.accessToken)
    } catch (e) {
        console.log(e)
        let errorMessage = (e as AxiosError<AxiosResponse>)?.response?.data.error
        throw new Error(errorMessage)
    }
}
