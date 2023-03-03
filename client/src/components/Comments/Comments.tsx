import { WithLikes } from 'models/Generics'
import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Comment } from './Comment/Comment'
import styles from './Comments.module.scss'

interface CommentsProps {
    comments: WithLikes<CommentModel>[]
    onCommentAvatarClicked?: AnyFunction
    className?: string
}

//TODO AUTO SCROLL TO NEW COMMENT

export function Comments({ comments, onCommentAvatarClicked, className }: CommentsProps) {
    if (!comments || comments.length === 0) {
        return <h5>Нет комментариев :\ </h5>
    }

    return (
        <div className={`${styles.wrapper} ${className || ''}`}>
            {comments?.map((comment) => (
                <Comment onAvatarClicked={onCommentAvatarClicked} key={comment.data.id} comment={comment} />
            ))}
        </div>
    )
}
