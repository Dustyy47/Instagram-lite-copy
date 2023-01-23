import { useEffect, useRef } from 'react'
import styles from './Modal.module.scss'

export function Modal({ isActive, setActive, ...props }) {
    let scrollBeforeOpen = useRef(0)

    useEffect(() => {
        if (isActive) {
            scrollBeforeOpen.current = window.scrollY
            document.body.style.top = `-${window.scrollY}px`
            document.body.classList.add(styles.fixed)
        } else {
            document.body.classList.remove(styles.fixed)
            window.scrollTo(0, scrollBeforeOpen.current)
        }
    }, [isActive])

    return (
        <div
            onClick={(e) => setActive(false)}
            className={`${styles.modal} ${!isActive ? styles['modal--hidden'] : ''}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={styles.content}
                style={props.modalStyles}
            >
                {props.children}
            </div>
        </div>
    )
}
