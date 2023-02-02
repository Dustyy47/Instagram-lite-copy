import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { userActions } from '../store/slices/userSlice'

/**Remove token from localstorage, reset user state and navigate user to login form*/
export function useLogout(): Function {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return () => {
        localStorage.removeItem('token')
        dispatch(userActions.logout())
        navigate('/auth/login')
    }
}
