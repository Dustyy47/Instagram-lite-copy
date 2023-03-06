import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserModel } from '../../models/ProfileOwnerModel'
import { Loading } from '../UI/Loading/Loading'
import { UserInfo } from './UserInfo'
import styles from './UsersList.module.scss'

interface UsersListProps extends Omit<React.HTMLProps<HTMLDivElement>, 'onClick'> {
    users: UserModel[]
    title: string
    onClick?: (user: UserModel) => any
    isLoading?: boolean
    children?: ReactElement | string
}

//TODO REMOVE INLINE STYLES

export function UsersList({ users, title, onClick, isLoading, children, className }: UsersListProps) {
    const navigate = useNavigate()

    const handleClickToUser = (user: UserModel) => {
        if (onClick) onClick(user)
        navigate('/profile/' + user.nickname)
    }

    if (isLoading) {
        return (
            <div className={`${styles.wrapper} ${className}`}>
                <Loading />
            </div>
        )
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
