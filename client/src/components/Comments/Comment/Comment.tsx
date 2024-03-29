import { CommentLikeBtn } from 'components/LikeBtns/CommentLikeBtn'
import { getPassedTime } from 'helpers/formatTime'
import { useInitLikes } from 'hooks/useInitLikes'
import { WithLikes } from 'models/Generics'
import { AnyFunction } from '../../../models/CallbacksTypes'
import { CommentModel } from '../../../models/CommentModel'
import { Avatar } from '../../Avatar/Avatar'
import styles from './Comment.module.scss'

interface CommentProps {
    comment: WithLikes<CommentModel>
    onAvatarClicked?: AnyFunction
}

export function Comment({ comment, onAvatarClicked }: CommentProps) {
    const { text, author, created_at, post_id, id } = comment.data
    useInitLikes<CommentModel>(comment, 'comment')

    return (
        <div className={styles.wrapper}>
            <Avatar onClick={onAvatarClicked} nickName={author?.nickname} url={author?.avatarUrl} className={styles.avatar} />
            <div className={styles.infoWrapper}>
                <div className={styles.header}>
                    <span className={styles.nickName}>{author?.nickname}</span>
                    <div className={styles.headerRight}>
                        <span className={styles.passedTime}>{getPassedTime(created_at)}</span>
                        <CommentLikeBtn postID={post_id} commentID={id} />
                    </div>
                </div>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    )
}
