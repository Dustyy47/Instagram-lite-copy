import { AxiosError } from 'axios'
import jwtDecode from 'jwt-decode'
import { AxiosResponse } from '../models/Http'
import { $host } from './index'

export const login = async (email: string, password: string) => {
    try {
        const { data } = await $host.post('/auth/login', { email, password })
        localStorage.setItem('token', data)
        return jwtDecode(data)
    } catch (e) {
        console.log(e)
        throw new Error((e as AxiosError<AxiosResponse>)?.response?.data?.message)
    }
}

export const registration = async (inputData: any) => {
    try {
        const { data } = await $host.post('/auth/registration', inputData)
        localStorage.setItem('token', data)
        return jwtDecode(data)
    } catch (e) {
        console.log(e)
        const errors = (e as AxiosError<AxiosResponse>)?.response?.data
        let errorMessage = ''
        if (Array.isArray(errors)) {
            errors.forEach((error) => (errorMessage += error.message))
        } else errorMessage = errors?.message ? errors.message : ''
        throw new Error(errorMessage)
    }
}
