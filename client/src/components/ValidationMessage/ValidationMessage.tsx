import styles from './ValidationMessage.module.scss'

interface ValidationMessageProps {
    errorsString: string
    isHidden: boolean
}

export function ValidationMessage({ errorsString, isHidden }: ValidationMessageProps) {
    const isActive = !isHidden && errorsString !== ''
    return <div className={`${styles.wrapper} ${isActive && styles.active}`}>{errorsString}</div>
}
