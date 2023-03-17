import { useNavigate } from 'react-router-dom'
import { userActions } from 'store/slices/userSlice'
import { useAppDispatch } from '../store/hooks'

export function useUserAuthRedirect() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    return (userId: string) => {
        navigate(`/profile/${userId}`)
        dispatch(userActions.getData())
    }
}
