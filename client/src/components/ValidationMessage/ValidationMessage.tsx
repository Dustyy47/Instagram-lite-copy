import styles from './ValidationMessage.module.scss'

interface ValidationMessageProps {
    errorsString: string
    isHidden: boolean
    className?: string
}

export function ValidationMessage({ errorsString, isHidden, className }: ValidationMessageProps) {
    const isActive = !isHidden && errorsString !== ''
    return <div className={`${styles.wrapper} ${isActive && styles.active} ${className || ''}`}>{errorsString}</div>
}
