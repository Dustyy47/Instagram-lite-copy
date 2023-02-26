import { ChooseEmojiCallback } from 'models/CallbacksTypes'
import { emojis as emojisMock } from '../../mock/emojis'
import styles from './Emojis.module.scss'

interface EmojisProps {
    isClosed: boolean
    onChoose: ChooseEmojiCallback
    className?: string
    forwardRef?: React.RefObject<any>
}

const emojis = [...emojisMock]

export function Emojis({ onChoose, className, isClosed, forwardRef }: EmojisProps) {
    function handleClick(emoji: string, e: React.MouseEvent) {
        onChoose(emoji, e)
    }

    return (
        <ul
            tabIndex={0}
            ref={forwardRef}
            className={`${styles.wrapper} ${className || ''} ${isClosed ? styles.closed : ''}`}
            data-closed={isClosed}
        >
            {emojis.map((emoji) => (
                <div key={emoji} tabIndex={0} onClick={(e) => handleClick(emoji, e)} className={styles.emoji}>
                    {emoji}
                </div>
            ))}
        </ul>
    )
}
