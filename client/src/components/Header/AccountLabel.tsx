import { useLocation, useNavigate } from 'react-router-dom'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { Status } from '../../models/LoadingStatus'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

interface AccountLabelProps {
    className?: string
}

export function AccountLabel({ className }: AccountLabelProps) {
    const { loadingStatus, avatarUrl, nickName, fullName } = useCombinedSelector('user', [
        'loadingStatus',
        'avatarUrl',
        'nickName',
        'fullName',
    ])

    const location = useLocation()
    const navigate = useNavigate()

    function generateData() {
        if (loadingStatus === Status.loading) {
            return {
                avatarUrl: '#',
                userName: '',
                link: '/auth/login',
            }
        }
        if (avatarUrl !== '')
            return {
                avatarUrl: avatarUrl,
                userName: fullName,
                link: `/profile/${nickName}`,
            }
        return {
            avatarUrl: '',
            userName: 'Гость',
            link: '/auth/login',
        }
    }

    let data = generateData()

    function handleClick() {
        if (data.link === location.pathname) {
            return
        }
        navigate(data.link)
    }

    return (
        <div onClick={handleClick} className={`${styles.userInfo} ${className}`}>
            <Avatar url={data.avatarUrl}></Avatar>
            <span className={styles.userName}>{data.userName}</span>
        </div>
    )
}
