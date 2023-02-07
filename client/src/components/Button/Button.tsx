import { CSSProperties, FC, MouseEvent, MouseEventHandler, ReactNode } from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
    onClick: MouseEventHandler
    style?: CSSProperties | undefined
    disabled?: boolean
    className?: string
    children?: ReactNode
}

export const Button: FC<ButtonProps> = ({ onClick, style, disabled, className, children }) => {
    const click = (e: MouseEvent) => {
        e.preventDefault()
        if (onclick !== undefined) onClick(e)
    }
    return (
        <button
            style={style}
            disabled={disabled}
            onClick={click}
            className={`${styles.button} ${disabled ? styles.disabled : ''} ${className ? className : ''}`}
        >
            {children}
        </button>
    )
}
