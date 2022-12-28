import styles from './Modal.module.scss'

export function Modal({ isActive, setActive, ...props }) {
    return (
        <div
            onClick={() => setActive(false)}
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
