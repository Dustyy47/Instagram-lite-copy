import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, registration } from '../../http/userApi.js'
import { fetchUserData } from '../../store/slices/userSlice'
import { Login } from './Login'
import { Registration } from './Registration'

export function Auth() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let isLogin = location.pathname === '/auth/login'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [avatarImage, setAvatarImage] = useState(null)
    const [fullName, setFullName] = useState('')
    const [nickName, setNickName] = useState('')
    const [error, setError] = useState('')

    const resetFields = useCallback((fromRegister = false) => {
        setEmail('')
        setPassword('')
        if (!fromRegister) return
        setAvatarImage(null)
        setFullName('')
        setNickName('')
    }, [])

    const onLogin = async () => {
        try {
            const response = await login(email, password)
            setError('')
            redirect(response.nickName)
        } catch (e) {
            console.log(e.message)
            setError(e.message)
        }
    }

    const onRegister = async () => {
        try {
            const data = new FormData()
            data.append('email', email)
            data.append('password', password)
            data.append('fullName', fullName)
            data.append('avatarImage', avatarImage)
            data.append('nickName', nickName)
            const response = await registration(data)
            redirect(response.nickName)
        } catch (e) {
            console.log(e.message)
            setError(e.message)
        }
    }

    const redirect = async (userId) => {
        navigate(`/profile/${userId}`)
        dispatch(fetchUserData())
    }

    const loginProps = {
        email,
        setEmail,
        password,
        setPassword,
        onLogin,
        resetFields,
        error,
    }

    const registrationProps = {
        ...loginProps,
        fullName,
        setFullName,
        setAvatarImage,
        onRegister,
        nickName,
        setNickName,
    }

    if (isLogin) return <Login {...loginProps} />
    return <Registration {...registrationProps} />
}
