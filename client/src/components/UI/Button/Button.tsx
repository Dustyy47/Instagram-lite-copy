import { CSSProperties, MouseEvent, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
    onClick: MouseEventHandler
    style?: CSSProperties | undefined
    disabled?: boolean
    className?: string
    children?: ReactNode
}

export function Button({ onClick, style, disabled, className, children }: ButtonProps) {
    const click = (e: MouseEvent) => {
        e.preventDefault()
        if (onclick !== undefined) onClick(e)
    }
    return (
        <button
            tabIndex={0}
            style={style}
            disabled={disabled}
            onClick={click}
            className={`${styles.button} ${disabled ? styles.disabled : ''} ${className ? className : ''}`}>
            {children}
        </button>
    )
}
