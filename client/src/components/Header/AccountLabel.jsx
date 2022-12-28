import { Link } from 'react-router-dom'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

export function AccountLabel({ data }) {
    const { link, avatarUrl, userName } = data
    return (
        <Link to={link} className={styles.userInfo}>
            <Avatar url={avatarUrl}></Avatar>
            <span className={styles.userName}>{userName}</span>
        </Link>
    )
}
