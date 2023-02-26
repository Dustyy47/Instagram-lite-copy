import { AxiosError } from 'axios'
import jwtDecode from 'jwt-decode'
import { AxiosResponse } from '../models/Http'
import { ProfileOwnerModel } from './../models/ProfileOwnerModel'
import { $host } from './index'

const LOGIN_URL = '/auth/login/'
const REGISTRATION_URL = '/auth/registration'

export const login = async (email: string, password: string) => {
    try {
        const { data } = await $host.post(LOGIN_URL, { email, password })
        localStorage.setItem('token', data)
        return jwtDecode<ProfileOwnerModel>(data)
    } catch (e) {
        console.log(e)
        throw new Error((e as AxiosError<AxiosResponse>)?.response?.data?.message)
    }
}

export const registration = async (inputData: FormData) => {
    try {
        const { data } = await $host.post(REGISTRATION_URL, inputData)
        localStorage.setItem('token', data)
        return jwtDecode<ProfileOwnerModel>(data)
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
