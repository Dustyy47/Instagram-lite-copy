import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Comment } from './Comment/Comment'
import styles from './Comments.module.scss'

interface CommentsProps {
    comments: CommentModel[]
    onCommentAvatarClicked: AnyFunction
    isMobile?: boolean
}

//TODO AUTO SCROLL TO NEW COMMENT

export function Comments({ comments, onCommentAvatarClicked }: CommentsProps) {
    return (
        <div className={styles.wrapper}>
            {comments?.map((comment) => (
                <Comment
                    onAvatarClicked={onCommentAvatarClicked}
                    key={comment._id}
                    authorInfo={{ ...comment.author }}
                    commentInfo={{
                        _id: comment._id,
                        text: comment.text,
                        createdAt: comment.createdAt,
                        updatedAt: comment.updatedAt,
                    }}
                />
            ))}
        </div>
    )
}
