import { UserModel } from 'models/ProfileOwnerModel'
import React, { useCallback, useRef, useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { searchUsers } from '../../http/profileApi'
import { Input } from '../UI/Input/Input'
import { UsersList } from '../UsersList/UsersList'
import styles from './Search.module.scss'

const SEARCH_TIME = 333
const USERS_PER_PAGE = 5

interface SearchProps {
    className?: string
}

export function Search({ className }: SearchProps) {
    const [areUsersHidden, setUsersHidden] = useState(true)
    const [users, setUsers] = useState<UserModel[]>([])
    const [isLoading, setLoading] = useState(false)
    let page = useRef(0)
    let timer = useRef<NodeJS.Timeout>()
    let input = useRef<HTMLInputElement>(null)

    const handleScroll = useCallback(
        (e: React.WheelEvent<HTMLDivElement>) => {
            if (e.currentTarget.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight) === 0) {
                fetchUsers(USERS_PER_PAGE, page.current * USERS_PER_PAGE)
            }
        },
        [page]
    )

    const focusSearch = () => {
        if (input.current?.value) setUsersHidden(false)
    }

    const fetchUsers = async (limit: number, offset: number) => {
        const foundUsers = await searchUsers(input.current?.value || '', limit, offset)
        if (foundUsers && foundUsers.length > 0) {
            setUsers((prevState) => {
                return (prevState = prevState.concat(foundUsers))
            })
            page.current++
        }

        setLoading(false)
        return foundUsers
    }

    const typing = async (value: string) => {
        page.current = 0
        value = value.trim()
        setUsers([])
        if (!value) {
            setUsersHidden(true)
            return
        }
        setUsersHidden(false)
        setLoading(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            fetchUsers(USERS_PER_PAGE, 0)
        }, SEARCH_TIME)
    }

    const unFocusSearch = () => {
        setUsersHidden(true)
    }

    //TODO Fix inline styles

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <Input
                forwardRef={input}
                onBlur={unFocusSearch}
                onFocus={focusSearch}
                onChange={typing}
                className={styles.inputWrapper}
                inputClassName={styles.input}
            >
                <BiSearchAlt2 style={{ fontSize: 32, fill: '#ededed', margin: '0 15px' }} />
            </Input>
            <div>
                <UsersList
                    isLoading={isLoading}
                    users={users}
                    title={''}
                    onScroll={handleScroll}
                    className={`${styles.users} ${areUsersHidden ? styles.hidden : ''}`}
                >
                    <div className={styles.fallbackMessage}>
                        <p>🙁</p>
                        <p>Пользователей с таким именем не существует</p>
                    </div>
                </UsersList>
            </div>
        </div>
    )
}
