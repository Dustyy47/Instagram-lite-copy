import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/userSlice'

//remove token from localstorage, reset user state and navigate user to login form
export function useLogout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    return () => {
        localStorage.removeItem('token')
        dispatch(logout())
        navigate('/auth/login')
    }
}
