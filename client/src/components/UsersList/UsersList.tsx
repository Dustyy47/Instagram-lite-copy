import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { Loading } from '../Loading/Loading'
import { UsersListItem } from './UsersListItem'

interface UsersListProps {
    users: ProfileOwnerModel[]
    title: string
    onClick?: (user: ProfileOwnerModel) => any
    isLoading?: boolean
    children?: ReactElement | string
}

//TODO REMOVE INLINE STYLES

export function UsersList({ users, title, onClick, isLoading, children }: UsersListProps) {
    const navigate = useNavigate()

    const handleClickToUser = (user: ProfileOwnerModel) => {
        navigate('/profile/' + user.nickName)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <h3>{title}</h3>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li>
                            <UsersListItem
                                onClick={onClick ? () => onClick(user) : () => handleClickToUser(user)}
                                key={user._id}
                                user={user}
                            />
                        </li>
                    ))
                ) : (
                    <>{children}</>
                )}
            </ul>
        </div>
    )
}
