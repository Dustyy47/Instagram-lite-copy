import { memo, useCallback, useEffect, useState } from 'react'
import { getCorrectImageUrl } from '../../helpers/getCorrectAvatarUrl'
import { getComments, sendComment } from '../../http/postsApi'
import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Status } from '../../models/LoadingStatus'
import { ExtendedPostModel } from '../../models/PostModel'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Comments } from '../Comments/Comments'
import { Input } from '../Input/Input'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import { Loading } from '../Loading/Loading'
import { Modal } from '../Modal/Modal'
import styles from './ExtendedPost.module.scss'
interface ExtendedPostProps {
    setActive: (value: boolean) => any
    onLike: AnyFunction
    postInfo: ExtendedPostModel
    authorInfo: ProfileOwnerModel
    isLiked: boolean
}

export const ExtendedPost = memo(function ExtendedPost(props: ExtendedPostProps) {
    const { setActive, postInfo, authorInfo, onLike, isLiked } = props
    const { avatarUrl, nickName } = authorInfo
    const { postData, likesCountWithoutUser, isActive } = postInfo
    const { _id, title, description, imageUrl } = postData

    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<CommentModel[]>([])
    const [commentsStatus, setCommentsStatus] = useState<Status>(Status.loading)

    const like = (e: React.MouseEvent) => {
        onLike(_id)
    }

    const handleInputComment = useCallback(function (value: string) {
        setCommentText(value)
    }, [])

    const handleSendComment = useCallback(
        async function () {
            try {
                setCommentsStatus(() => Status.loading)
                const newComment = await sendComment(commentText, _id)
                if (newComment) {
                    setComments((prev) => [...prev, newComment])
                }
                setCommentsStatus(() => Status.idle)
            } catch (e) {
                console.log(e)
            }
        },
        [_id, commentText]
    )

    useEffect(() => {
        async function fetchGetComments() {
            if (!_id) return
            setComments([...(await getComments(_id))])
            setCommentsStatus(() => Status.idle)
        }
        setCommentsStatus(() => Status.loading)
        fetchGetComments()
    }, [_id])

    function renderComments() {
        if (!comments || comments.length === 0) {
            return <h5>Нет комментариев :\ </h5>
        }
        if (commentsStatus === Status.loading) {
            return <Loading />
        }
        return <Comments onCommentAvatarClicked={() => setActive(false)} comments={comments} />
    }

    return (
        <Modal
            isActive={isActive}
            setActive={setActive}
            modalStyles={{ width: '70%', maxWidth: 'auto', height: '90%' }}
        >
            <div className={styles.wrapper}>
                <img className={styles.photo} src={getCorrectImageUrl(imageUrl)} alt="" />
                <div className={styles.info}>
                    <div className={styles.header}>
                        <div className={styles.profileInfo}>
                            <Avatar url={avatarUrl || ''} />
                            <p className={styles.nickName}>{nickName}</p>
                        </div>
                        <LikeBtn
                            isLiked={isLiked}
                            onLike={like}
                            likesCount={likesCountWithoutUser + +isLiked}
                            className={styles.likeBtn}
                        />
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.title}>{title}</h3>
                        <p>{description}</p>
                    </div>

                    {renderComments()}

                    <form className={styles.sendForm}>
                        <Input className={styles.commentInput} value={commentText} onChange={handleInputComment} />
                        <Button className={styles.sendCommentBtn} onClick={handleSendComment}>
                            Отправить
                        </Button>
                    </form>
                    <div></div>
                </div>
            </div>
        </Modal>
    )
})
