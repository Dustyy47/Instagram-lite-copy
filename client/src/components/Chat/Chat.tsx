// import { setConversations } from '../../store/slices/chatSlice'
import { ActiveChat } from './ActiveChat'
import styles from './Chat.module.scss'
import { ChatsList } from './ChatsList'

//const socket = io('ws://localhost:8000')
//const s = new WebSocket()

export function Chat() {
    return (
        <div className={styles.root}>
            <ChatsList />
            <ActiveChat />
        </div>
    )
}
