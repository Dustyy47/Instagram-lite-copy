import { SendMessageBar, SendMessageBarClassnames } from 'components/SendMessageBar/SendMessageBar'
import styles from './ActiveChat.module.scss'

const messageBarClassNames: SendMessageBarClassnames = {
    form: styles.form,
    inputWrapper: styles.inputWrapper,
    leftWrapper: styles.formLeftWrapper,
    input: styles.input,
}

export function ActiveChat() {
    function handleSendMessage(message: string) {
        alert(message)
    }
    return (
        <div className={styles.chat}>
            <SendMessageBar onSend={handleSendMessage} classNames={messageBarClassNames}></SendMessageBar>
        </div>
    )
}
