import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { Avatar } from '../Avatar/Avatar'
import styles from './UsersList.module.scss'

interface UsersListItemProps {
    user: ProfileOwnerModel
    onClick: React.MouseEventHandler
}

export function UsersListItem(props: UsersListItemProps) {
    const { user, onClick } = props
    return (
        <div onClick={onClick} className={styles.item}>
            <Avatar url={user.avatarUrl as string} />
            <h5>{user.fullName}</h5>
        </div>
    )
}
