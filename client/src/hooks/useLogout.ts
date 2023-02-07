import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { userActions } from '../store/slices/userSlice'
import { AnyFunction } from './../models/CallbacksTypes'

/**Remove token from localstorage, reset user state and navigate user to login form*/
export function useLogout(): AnyFunction {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return () => {
        localStorage.removeItem('token')
        dispatch(userActions.logout())
        navigate('/auth/login')
    }
}
