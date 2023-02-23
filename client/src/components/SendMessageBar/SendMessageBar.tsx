import { EmojiPicker } from 'components/Emojis/PickEmoji'
import { Button } from 'components/UI/Button/Button'
import { Input } from 'components/UI/Input/Input'
import { useFormValidator, useValidator } from 'hooks/validators'
import { useState } from 'react'
import { RiSendPlaneLine } from 'react-icons/ri'
import styles from './SendMessageBar.module.scss'

interface SendMessageBarProps {
    onSend: (text: string) => any
    className?: string
}

export function SendMessageBar({ onSend, className }: SendMessageBarProps) {
    const [message, setMessage] = useState('')

    const messageValidator = useValidator([])
    const formValidator = useFormValidator(messageValidator)

    function chooseEmoji(emoji: string) {
        messageValidator.validate(message + emoji)
        setMessage((prev) => prev + emoji)
    }

    function handleSend() {
        onSend(message)
        formValidator.hideAll()
        setMessage('')
    }

    return (
        <form className={`${styles.form} ${className || ''}`}>
            <div className={styles.formLeftWrapper}>
                <EmojiPicker className={styles.emojiPicker} onChoose={chooseEmoji} />
                <Input
                    isHiddenPermanently={true}
                    isHiddenBeforeBlur={true}
                    validator={messageValidator}
                    className={styles.commentInput}
                    value={message}
                    onChange={setMessage}
                />
            </div>
            <Button className={styles.sendBtn} onClick={handleSend} disabled={formValidator.hasErrors()}>
                <span className={styles.sendBtnText}>Отправить</span>
                <RiSendPlaneLine className={styles.sendBtnIcon} />
            </Button>
        </form>
    )
}
