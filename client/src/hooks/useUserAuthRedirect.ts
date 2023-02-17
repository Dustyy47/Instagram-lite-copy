import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/hooks'
import { fetchUserData } from '../store/slices/userSlice'

export function useUserAuthRedirect() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return (userId: string) => {
        navigate(`/profile/${userId}`)
        dispatch(fetchUserData())
    }
}
