import { useNavigate } from 'react-router-dom'
import { fetchUserData } from '../store/slices/userSlice'
import { useAppDispatch } from './../store/hooks'

export function useProfileRedirect() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return (userId: string) => {
        navigate(`/profile/${userId}`)
        dispatch(fetchUserData())
    }
}
