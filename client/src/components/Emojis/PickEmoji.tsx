import { useRef, useState } from 'react'
import { VscSmiley } from 'react-icons/vsc'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { Emojis } from './Emojis'
import styles from './PickEmoji.module.scss'

interface EmojiPickerProps {
    onChoose: (emoji: string) => any
    className?: string
}

export function EmojiPicker({ onChoose, className }: EmojiPickerProps) {
    const [areEmojisVisible, setEmojisVisible] = useState(false)

    const emojisRef = useRef(null)
    useOutsideClick(emojisRef, closeEmojis)

    function closeEmojis() {
        setEmojisVisible(false)
    }

    function toggleEmojis() {
        console.log('toggled')

        setEmojisVisible((prev) => !prev)
    }

    return (
        <div ref={emojisRef} className={styles.wrapper + ' ' + className || ''}>
            <Emojis className={styles.emojis} isClosed={!areEmojisVisible} onChoose={onChoose}></Emojis>
            <VscSmiley tabIndex={0} onClick={toggleEmojis} className={styles.emojisBtn}></VscSmiley>
        </div>
    )
}
