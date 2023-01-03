import { Avatar } from '../../Avatar/Avatar'
import styles from './Comment.module.scss'

export function Comment({ authorInfo, commentInfo, onAvatarClicked }) {
    const { nickName, avatarUrl } = authorInfo
    const { text } = commentInfo
    return (
        <div className={styles.wrapper}>
            <Avatar
                onClick={onAvatarClicked}
                nickName={nickName}
                url={avatarUrl}
                style={{ width: 45, height: 45, marginLeft: 10 }}
            />
            <div className={styles.infoWrapper}>
                <span className={styles.nickName}>{nickName}</span>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    )
}
