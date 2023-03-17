import { UserModel } from '../../models/ProfileOwnerModel'
import { Avatar } from '../Avatar/Avatar'
import styles from './UsersList.module.scss'

export interface UserInfoClassnames {
    wrapper?: string
    avatar?: string
    name?: string
}

interface UserInfoProps {
    user: UserModel
    onClick: React.MouseEventHandler
    classNames?: UserInfoClassnames
}

export function UserInfo({ user, onClick, classNames }: UserInfoProps) {
    return (
        <div onClick={onClick} className={` ${classNames?.wrapper || ''} ${styles.item}`}>
            <Avatar className={classNames?.avatar || ''} url={user.avatarUrl as string} />
            <p className={classNames?.name || ''}>{user.fullname}</p>
        </div>
    )
}
