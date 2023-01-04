import { Comment } from './Comment/Comment'
import styles from './Comments.module.scss'

export function Comments({ comments, onCommentAvatarClicked }) {
    return (
        <div className={styles.wrapper}>
            {comments?.map((comment) => (
                <Comment
                    onAvatarClicked={onCommentAvatarClicked}
                    key={comment._id}
                    authorInfo={{
                        id: comment.author._id,
                        fullName: comment.author.fullName,
                        avatarUrl: comment.author.avatarUrl,
                        nickName: comment.author.nickName,
                    }}
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
