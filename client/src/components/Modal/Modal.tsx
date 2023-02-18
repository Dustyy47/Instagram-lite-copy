import { useEffect, useRef } from 'react'
import { AnyFunction } from '../../models/CallbacksTypes'
import styles from './Modal.module.scss'

interface ModalProps {
    isActive: boolean
    setActive: AnyFunction
    //TODO REFACTOR NAMINGS FOR STYLES PROPS IN ALL COMPONENTS
    closeByOutsideClick?: boolean
    className?: string
    children: React.ReactElement
    style?: React.CSSProperties
    shouldFixBody?: boolean
}

export function Modal({
    isActive,
    setActive,
    children,
    className,
    closeByOutsideClick = true,
    style,
    shouldFixBody = true,
}: ModalProps) {
    let scrollBeforeOpen = useRef(0)

    useEffect(() => {
        if (!shouldFixBody) return
        if (isActive) {
            scrollBeforeOpen.current = window.scrollY
            document.body.style.top = `-${window.scrollY}px`
            document.body.classList.add(styles.fixed)
        } else {
            document.body.classList.remove(styles.fixed)
            window.scrollTo(0, scrollBeforeOpen.current)
        }
    }, [isActive])

    function handleOutsideClick() {
        if (closeByOutsideClick) setActive(false)
    }

    return (
        <div
            onClick={handleOutsideClick}
            style={style}
            className={`${styles.modal} ${!isActive && styles['modal--hidden']} ${className}`}
        >
            <div onClick={(e) => e.stopPropagation()} className={styles.content}>
                {children}
            </div>
        </div>
    )
}
