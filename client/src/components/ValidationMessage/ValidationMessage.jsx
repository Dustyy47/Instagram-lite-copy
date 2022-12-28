import styles from './ValidationMessage.module.scss'

export function ValidationMessage({ errorsString, show }) {
    return (
        <div className={`${styles.wrapper} ${!show || errorsString === '' ? '' : styles.active}`}>
            {errorsString}
        </div>
    )
}
