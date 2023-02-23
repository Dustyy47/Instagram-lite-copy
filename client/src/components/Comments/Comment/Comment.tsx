import { AnyFunction } from '../../../models/CallbacksTypes'
import { CommentModel } from '../../../models/CommentModel'
import { Avatar } from '../../Avatar/Avatar'
import styles from './Comment.module.scss'

interface CommentProps {
    commentInfo: CommentModel
    onAvatarClicked?: AnyFunction
}

export function Comment({ commentInfo, onAvatarClicked }: CommentProps) {
    const { text, author } = commentInfo
    const { nickName, avatarUrl } = author
    return (
        <div className={styles.wrapper}>
            <Avatar onClick={onAvatarClicked} nickName={nickName} url={avatarUrl || ''} className={styles.avatar} />
            <div className={styles.infoWrapper}>
                <span className={styles.nickName}>{nickName}</span>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    )
}
