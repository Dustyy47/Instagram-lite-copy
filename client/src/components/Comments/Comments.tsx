import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Comment } from './Comment/Comment'
import styles from './Comments.module.scss'

interface CommentsProps {
    comments: CommentModel[]
    onCommentAvatarClicked: AnyFunction
}

export function Comments(props: CommentsProps) {
    const { comments, onCommentAvatarClicked } = props
    return (
        <div className={styles.wrapper}>
            {comments?.map((comment) => (
                <Comment
                    onAvatarClicked={onCommentAvatarClicked}
                    key={comment.id}
                    authorInfo={{ ...comment.author }}
                    commentInfo={{
                        text: comment.text,
                        createdAt: comment.createdAt,
                        updatedAt: comment.updatedAt,
                    }}
                />
            ))}
        </div>
    )
}
