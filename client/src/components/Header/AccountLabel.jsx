import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { placeholderUrl } from '../Auth/Registration'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

export function AccountLabel() {
    const { loadingStatus, avatarUrl, nickName, fullName } = useSelector((state) => state.user)
    const location = useLocation()
    const navigate = useNavigate()

    function generateData() {
        if (loadingStatus === LoadingStatuses.loading) {
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
            avatarUrl: placeholderUrl,
            userName: 'Гость',
            link: '/auth/login',
        }
    }

    let data = generateData()

    function handleClick(e) {
        debugger
        if (data.link === location.pathname) {
            return
        }
        console.log(data.link, location.pathname)
        navigate(data.link)
    }

    return (
        <div onClick={handleClick} className={styles.userInfo}>
            <Avatar url={data.avatarUrl}></Avatar>
            <span className={styles.userName}>{data.userName}</span>
        </div>
    )
}
