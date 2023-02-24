import { EmojiPicker } from 'components/Emojis/PickEmoji'
import { Button } from 'components/UI/Button/Button'
import { Input } from 'components/UI/Input/Input'
import { useFormValidator, useValidator } from 'hooks/validators'
import { useState } from 'react'
import { RiSendPlaneLine } from 'react-icons/ri'
import styles from './SendMessageBar.module.scss'

interface SendMessageBarProps {
    onSend: (text: string) => any
    classNames?: {
        form?: string
        emojiPicker?: string
        input?: string
        sendBtn?: string
        sendBtnText?: string
        sendBtnIcon?: string
    }
}

export function SendMessageBar({ onSend, classNames }: SendMessageBarProps) {
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
        <form className={`${styles.form} ${classNames?.form || ''}`}>
            <div className={styles.formLeftWrapper}>
                <EmojiPicker className={classNames?.emojiPicker || ''} onChoose={chooseEmoji} />
                <Input
                    isHiddenPermanently={true}
                    isHiddenBeforeBlur={true}
                    validator={messageValidator}
                    className={classNames?.input || ''}
                    value={message}
                    onChange={setMessage}
                />
            </div>
            <Button className={classNames?.sendBtn || ''} onClick={handleSend} disabled={formValidator.hasErrors()}>
                <span className={classNames?.sendBtnText || ''}>Отправить</span>
                <RiSendPlaneLine className={classNames?.sendBtnIcon || ''} />
            </Button>
        </form>
    )
}
