import { EmojiPicker } from 'components/Emojis/PickEmoji'
import { Button } from 'components/UI/Button/Button'
import { ValidatedComponent } from 'components/UI/Input/ValidatedComponent'
import { TextArea } from 'components/UI/TextArea/TextArea'
import { useFormValidator, useValidator } from 'hooks/validators'
import { useRef, useState } from 'react'
import { RiSendPlaneLine } from 'react-icons/ri'
import styles from './SendMessageBar.module.scss'

interface SendMessageBarProps {
    onSend: (text: string) => any
    classNames?: {
        form?: string
        emojiPicker?: string
        inputWrapper?: string
        input?: string
        sendBtn?: string
        sendBtnText?: string
        sendBtnIcon?: string
        leftWrapper?: string
    }
}

export function SendMessageBar({ onSend, classNames }: SendMessageBarProps) {
    const [message, setMessage] = useState('')

    const messageValidator = useValidator([])
    const formValidator = useFormValidator(messageValidator)
    const textArea = useRef<HTMLTextAreaElement | null>(null)

    function chooseEmoji(emoji: string) {
        messageValidator.validate(message + emoji)
        setMessage((prev) => {
            return (
                prev.slice(0, textArea.current?.selectionStart) +
                emoji +
                message.slice(textArea.current?.selectionStart)
            )
        })
    }

    function handleSend() {
        onSend(message)
        formValidator.hideAll()
        setMessage('')
    }

    return (
        <form className={`${styles.form} ${classNames?.form || ''}`}>
            <div className={`${styles.formLeftWrapper} ${classNames?.leftWrapper || ''}`}>
                <EmojiPicker className={classNames?.emojiPicker || ''} onChoose={chooseEmoji} />
                <ValidatedComponent classNames={{ wrapper: classNames?.inputWrapper }} validator={messageValidator}>
                    <TextArea
                        htmlProps={{
                            className: classNames?.input || '',
                        }}
                        value={message}
                        forwardRef={textArea}
                        onChange={setMessage}
                    />
                </ValidatedComponent>
            </div>
            <Button className={classNames?.sendBtn || ''} onClick={handleSend} disabled={formValidator.hasErrors()}>
                <span className={classNames?.sendBtnText || ''}>Отправить</span>
                <RiSendPlaneLine className={classNames?.sendBtnIcon || ''} />
            </Button>
        </form>
    )
}
