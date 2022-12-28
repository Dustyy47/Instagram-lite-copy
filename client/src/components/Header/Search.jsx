import React, { useEffect, useRef, useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { searchUsers } from '../../http/userApi'
import Input from '../Input/Input'
import UsersList from '../UsersList/UsersList'
import style from './Search.module.scss'

const searchTime = 333
const usersPerPage = 7

function Search() {
    const [value, setValue] = useState('')
    const [areUsersHidden, setUsersHidden] = useState(true)
    const [users, setUsers] = useState([])
    const [isLoading, setLoading] = useState(false)
    let page = useRef(0)
    let timer = useRef()
    let input = useRef()
    let usersList = useRef()

    function handleScroll(e) {
        if (e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) === 0) {
            fetchUsers(usersPerPage, page.current * usersPerPage)
        }
    }

    useEffect(() => {
        usersList.current.addEventListener('scroll', handleScroll)
    }, [])

    const focusSearch = () => {
        if (value) setUsersHidden(false)
    }

    const fetchUsers = async (limit, skip) => {
        const foundUsers = await searchUsers(input.current.value, limit, skip)
        if (foundUsers?.length > 0) {
            setUsers((prevState) => {
                return (prevState = prevState.concat(foundUsers))
            })
            page.current++
        }

        setLoading(false)
        return foundUsers
    }

    const typing = async (value) => {
        page.current = 0
        value = value.trim()
        setValue(value)
        if (!value) {
            setUsers([])
            setUsersHidden(true)
            return
        }
        setUsersHidden(false)
        setLoading(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            fetchUsers(usersPerPage, 0)
        }, searchTime)
    }

    const unFocusSearch = () => {
        setUsersHidden(true)
    }

    return (
        <div className={style.wrapper}>
            <Input
                forwardRef={input}
                onBlur={unFocusSearch}
                onFocus={focusSearch}
                value={value}
                onChange={typing}
                styleInput={{ width: 250, height: 40, color: '#363636' }}
                styleWrapper={{ margin: '0 30px' }}
            >
                <BiSearchAlt2 style={{ fontSize: 32, fill: '#ededed', margin: '0 15px' }} />
            </Input>
            <div ref={usersList} className={`${style.users} ${areUsersHidden ? style.hidden : ''}`}>
                <UsersList isLoading={isLoading} users={users} title={''}>
                    <p>Пользователей с таким именем не существует</p>
                    <p>🙁</p>
                </UsersList>
            </div>
        </div>
    )
}

export default Search
