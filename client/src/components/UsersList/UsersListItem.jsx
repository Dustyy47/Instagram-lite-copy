import { Avatar } from '../Avatar/Avatar'
import styles from './UsersList.module.scss'

export function UsersListItem({ user, onClick }) {
    return (
        <div onClick={onClick} className={styles.item}>
            <Avatar url={user.avatarUrl} />
            <h5>{user.fullName}</h5>
        </div>
    )
}
