import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getConversations } from '../../http/userApi'
import { setConversations } from '../../store/chatSlice'
import { UsersList } from '../UsersList/UsersList'
import styles from './Chat.module.scss'

export function Chat() {
    const { messages, messageText, conversations } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    const fetchConversations = async () => {
        const fetchedConversations = await getConversations()
        dispatch(setConversations(fetchedConversations))
        console.log(conversations)
    }

    useEffect(() => {
        fetchConversations()
    }, [])

    return (
        <div className={styles.root}>
            <div className={styles.chatsList}>
                <UsersList
                    users={[]}
                    title={''}
                    absenceText={''}
                    onClick={() => console.log('click')}
                ></UsersList>
            </div>
            <div className={styles.chat}></div>
        </div>
    )
}
