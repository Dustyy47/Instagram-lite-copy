import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import {
    fetchGetComments,
    fetchSendComment,
    open,
    setCommentText,
} from '../../store/slices/extendedPostSlice'
import { getCorrectImageUrl } from '../../utils/getCorrectAvatarUrl'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Comments } from '../Comments/Comments'
import { Input } from '../Input/Input'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import { Loading } from '../Loading/Loading'
import { Modal } from '../Modal/Modal'
import styles from './Post.module.scss'

export function ExtendedPost({
    isActive,
    setActive,
    postData = {},
    authorInfo = {},
    likeInfo = {},
}) {
    const { onLike, isLiked } = likeInfo
    const { avatarUrl, nickName } = authorInfo
    const { _id, title, description, likesCountWithoutUser, imageUrl } = postData
    const dispatch = useDispatch()
    const { commentText, comments, postLoadingStatus } = useSelector((state) => state.extendedPost)
    const like = (e) => {
        console.log(e)
        onLike(_id)
    }

    function handleInputComment(value) {
        dispatch(setCommentText(value))
    }

    function handleSendComment() {
        dispatch(fetchSendComment())
    }

    function renderComments() {
        if (!comments || comments.length === 0) {
            return <h5>Нет комментариев :\ </h5>
        }
        if (postLoadingStatus === LoadingStatuses.loading) {
            return <Loading />
        }
        return <Comments comments={comments} />
    }

    useEffect(() => {
        if (!_id) return
        dispatch(fetchGetComments(_id))
        dispatch(open(_id))
    }, [postData])

    return (
        <Modal
            isActive={isActive}
            setActive={() => setActive()}
            modalStyles={{ maxWidth: 1500, minHeight: 800 }}
        >
            <div className={styles.extended}>
                <img className={styles.photo} src={getCorrectImageUrl(imageUrl)} alt="" />
                <div className={styles.info}>
                    <div className={styles.header}>
                        <div className={styles.profileInfo}>
                            <Avatar url={avatarUrl} />
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
                        <p>
                            {description} Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Tempora, atque quia dolorum nesciunt quod pariatur laborum officia
                            debitis possimus doloremque consequatur dolor inventore perferendis
                            nobis iure, nisi dolorem. Recusandae, laborum. Lorem ipsum dolor sit
                            amet consectetur adipisicing elit. Quos ducimus rerum similique eveniet
                            exercitationem in sit cum quia fugiat nisi! Ducimus officiis repellat,
                            consequuntur doloribus eaque quidem autem hic sint!
                        </p>
                    </div>

                    {renderComments()}

                    <form className={styles.sendForm}>
                        <Input
                            className={styles.commentInput}
                            value={commentText}
                            onChange={handleInputComment}
                        />
                        <Button className={styles.sendCommentBtn} onClick={handleSendComment}>
                            Отправить
                        </Button>
                    </form>
                    <div></div>
                </div>
            </div>
        </Modal>
    )
}
