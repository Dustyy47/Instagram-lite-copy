import { Loading } from '../Loading/Loading'
import { Comment } from './Comment/Comment'
import styles from './Comments.module.scss'

export function Comments({ comments }) {
    if (!comments || comments?.length === 0) {
        return <Loading></Loading>
    }
    return (
        <div className={styles.wrapper}>
            {comments?.map((comment) => (
                <Comment
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
