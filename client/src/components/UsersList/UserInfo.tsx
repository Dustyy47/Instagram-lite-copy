import { UserItemModel } from '../../models/ProfileOwnerModel'
import { Avatar } from '../Avatar/Avatar'
import styles from './UsersList.module.scss'

interface UsersListItemProps {
    user: UserItemModel
    onClick: React.MouseEventHandler
}

export function UserInfo({ user, onClick }: UsersListItemProps) {
    return (
        <div onClick={onClick} className={styles.item}>
            <Avatar url={user.avatarUrl as string} />
            <p>{user.fullname}</p>
        </div>
    )
}
