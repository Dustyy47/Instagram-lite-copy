import styles from './ValidationMessage.module.scss'

interface ValidationMessageProps {
    errorsString: string
    show: boolean
}

export function ValidationMessage(props: ValidationMessageProps) {
    const { errorsString, show } = props
    return (
        <div className={`${styles.wrapper} ${!show || errorsString === '' ? '' : styles.active}`}>
            {errorsString}
        </div>
    )
}
