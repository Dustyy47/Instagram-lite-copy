import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { useCombinedSelector } from '../../selectors/selectors'
import { placeholderUrl } from '../Auth/Registration'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

export function AccountLabel() {
    const { loadingStatus, avatarUrl, nickName, fullName } = useCombinedSelector('user', [
        'loadingStatus',
        'avatarUrl',
        'nickName',
        'fullName',
    ])

    const location = useLocation()
    const navigate = useNavigate()

    console.log('rendered account label')

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

    function handleClick() {
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
