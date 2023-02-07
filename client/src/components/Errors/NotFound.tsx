import styles from './NotFound.module.scss'

export function NotFound() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.text}>Данный пользователь не найден</p>
        </div>
    )
}
