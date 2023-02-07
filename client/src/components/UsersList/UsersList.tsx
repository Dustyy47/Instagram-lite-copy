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

export function UsersList(props: UsersListProps) {
    const { users, title, onClick, isLoading, children } = props
    const navigate = useNavigate()

    const handleClickToUser = (user: ProfileOwnerModel) => {
        navigate('/profile/' + user.nickName)
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <h3>{title}</h3>
            {users.length > 0 ? (
                users.map((user) => (
                    <UsersListItem
                        onClick={onClick ? () => onClick(user) : () => handleClickToUser(user)}
                        key={user._id}
                        user={user}
                    />
                ))
            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'grey',
                        fontSize: 20,
                        flexDirection: 'column',
                        width: '95%',
                        height: '95%',
                        textAlign: 'center',
                    }}
                >
                    {children}
                </div>
            )}
        </>
    )
}
