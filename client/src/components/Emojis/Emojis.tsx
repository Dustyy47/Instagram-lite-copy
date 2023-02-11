import { emojis as emojisMock } from '../../mock/emojis'
import styles from './Emojis.module.scss'

interface EmojisProps {
    isClosed: boolean
    onChoose: (emoji: string) => any
    className?: string
    forwardRef?: React.RefObject<any>
}

const emojis = [...emojisMock]

export function Emojis({ onChoose, className, isClosed, forwardRef }: EmojisProps) {
    function handleClick(emoji: string) {
        onChoose(emoji)
    }

    return (
        <ul
            tabIndex={0}
            ref={forwardRef}
            className={`${styles.wrapper} ${className || ''} ${isClosed ? styles.closed : ''}`}
            data-closed={isClosed}
        >
            {emojis.map((emoji) => (
                <div key={emoji} tabIndex={0} onClick={() => handleClick(emoji)} className={styles.emoji}>
                    {emoji}
                </div>
            ))}
        </ul>
    )
}
