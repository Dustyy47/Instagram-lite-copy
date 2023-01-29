import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversations } from '../../http/userApi'
import { setConversations } from '../../store/slices/chatSlice'
import { UsersList } from '../UsersList/UsersList'
import styles from './Chat.module.scss'

export function Chat() {
    const { messages, messageText, conversations } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    const fetchConversations = async () => {
        const fetchedConversations = await getConversations()
        dispatch(setConversations(fetchedConversations))
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    return (
        <div className={styles.root}>
            <div className={styles.chatsList}>
                <UsersList users={[]} title={''} absenceText={''}></UsersList>
            </div>
            <div className={styles.chat}></div>
        </div>
    )
}
