import { useNavigate } from 'react-router-dom'
import { Status } from '../models/LoadingStatus'
import { useCombinedSelector } from './useCombinedSelector'

export function useProfileNavigate() {
    const { loadingStatus, avatarUrl, nickName, fullName } = useCombinedSelector('user', [
        'loadingStatus',
        'avatarUrl',
        'nickName',
        'fullName',
    ])

    const navigate = useNavigate()
    function generateData() {
        if (loadingStatus === Status.loading) {
            return {
                avatarUrl: '',
                userName: '',
                link: '/auth/login',
                isGuest: false,
            }
        }
        if (avatarUrl !== '')
            return {
                avatarUrl: avatarUrl,
                userName: fullName,
                link: `/profile/${nickName}`,
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
