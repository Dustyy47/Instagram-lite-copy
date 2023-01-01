import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

export function AccountLabel({ data }) {
    const { link, avatarUrl, userName } = data
    const location = useLocation()
    const navigate = useNavigate()

    function handleClick(e) {
        if (link === location.pathname) {
            return
        }
        console.log(link, location.pathname)
        navigate(link)
    }

    return (
        <div onClick={handleClick} className={styles.userInfo}>
            <Avatar url={avatarUrl}></Avatar>
            <span className={styles.userName}>{userName}</span>
        </div>
    )
}
