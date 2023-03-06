import { useNavigate } from 'react-router-dom'
import { useAppSelector } from 'store/hooks'
import { Status } from '../models/LoadingStatus'

export function useProfileNavigate() {
    const { profile: userProfile, entranceLoadingStatus, isGuest } = useAppSelector((state) => state.user)
    const { avatarUrl, fullname, nickname } = userProfile?.owner || {}
    const navigate = useNavigate()
    function generateData() {
        if (entranceLoadingStatus === Status.loading) {
            return {
                avatarUrl: '',
                userName: '',
                link: '/auth/login',
                isGuest: false,
            }
        }
        if (!isGuest)
            return {
                avatarUrl: avatarUrl,
                userName: fullname,
                link: `/profile/${nickname}`,
                isGuest: false,
            }
        return {
            avatarUrl: '',
            userName: 'Гость',
            link: '/auth/login',
            isGuest: true,
        }
    }
    let data = generateData()
    return {
        data,
        navigateToProfile() {
            navigate(data.link)
        },
    }
}
