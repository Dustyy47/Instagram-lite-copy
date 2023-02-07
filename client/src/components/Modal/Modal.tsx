import { useEffect, useRef } from 'react'
import { AnyFunction } from '../../models/CallbacksTypes'
import styles from './Modal.module.scss'

interface ModalProps {
    isActive: boolean
    setActive: AnyFunction
    //TODO REFACTOR NAMINGS FOR STYLES PROPS IN ALL COMPONENTS
    modalStyles?: React.CSSProperties
    children: React.ReactElement
}

export function Modal(props: ModalProps) {
    let scrollBeforeOpen = useRef(0)
    const { isActive, setActive } = props

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
            <div onClick={(e) => e.stopPropagation()} className={styles.content} style={props.modalStyles}>
                {props.children}
            </div>
        </div>
    )
}
