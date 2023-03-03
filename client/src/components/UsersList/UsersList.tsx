import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserItemModel } from '../../models/ProfileOwnerModel'
import { Loading } from '../UI/Loading/Loading'
import { UserInfo } from './UserInfo'
import styles from './UsersList.module.scss'

interface UsersListProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onClick'> {
    users: UserItemModel[]
    title: string
    onClick?: (user: UserItemModel) => any
    isLoading?: boolean
    children?: ReactElement | string
}

//TODO REMOVE INLINE STYLES

export function UsersList({ users, title, onClick, isLoading, children, className }: UsersListProps) {
    const navigate = useNavigate()

    const handleClickToUser = (user: UserItemModel) => {
        if (onClick) onClick(user)
        navigate('/profile/' + user.nickname)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <h3 className={styles.title}>{title}</h3>
            <ul className={styles.list}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.userID}>
                            <UserInfo onClick={() => handleClickToUser(user)} key={user.userID} user={user} />
                        </li>
                    ))
                ) : (
                    <>{children}</>
                )}
            </ul>
        </div>
    )
}
