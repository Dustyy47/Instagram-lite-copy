import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { Avatar } from '../Avatar/Avatar'
import styles from './UsersList.module.scss'

interface UsersListItemProps {
    user: ProfileOwnerModel
    onClick: React.MouseEventHandler
}

export function UsersListItem({ user, onClick }: UsersListItemProps) {
    return (
        <div onClick={onClick} className={styles.item}>
            <Avatar url={user.avatarUrl as string} />
            <p>{user.fullName}</p>
        </div>
    )
}
