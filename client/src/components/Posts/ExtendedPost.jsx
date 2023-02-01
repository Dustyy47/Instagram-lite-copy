import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCorrectImageUrl } from '../../helpers/getCorrectAvatarUrl'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { extendedPostActions } from '../../store/actions'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Comments } from '../Comments/Comments'
import { Input } from '../Input/Input'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import { Loading } from '../Loading/Loading'
import { Modal } from '../Modal/Modal'
import styles from './ExtendedPost.module.scss'

export function ExtendedPost({ setActive, postInfo = {}, authorInfo = {}, likeInfo = {} }) {
    const { onLike, isLiked } = likeInfo
    const { avatarUrl, nickName } = authorInfo
    const { postData, likesCountWithoutUser, isActive } = postInfo
    const { _id, title, description, imageUrl } = postData
    const { commentText, comments, postLoadingStatus } = useSelector((state) => state.extendedPost)
    const dispatch = useDispatch()
    const like = (e) => {
        onLike(_id)
    }

    function handleInputComment(value) {
        dispatch(extendedPostActions.setCommentText(value))
    }

    function handleSendComment() {
        dispatch(extendedPostActions.fetchSendComment())
    }

    function renderComments() {
        if (!comments || comments.length === 0) {
            return <h5>Нет комментариев :\ </h5>
        }
        if (postLoadingStatus === LoadingStatuses.loading) {
            return <Loading />
        }
        return <Comments onCommentAvatarClicked={() => setActive(false)} comments={comments} />
    }

    useEffect(() => {
        if (!_id) return
        dispatch(extendedPostActions.fetchGetComments(_id))
        dispatch(extendedPostActions.open(_id))
    }, [postInfo])

    return (
        <Modal
            isActive={isActive}
            setActive={() => setActive()}
            modalStyles={{ width: '70%', maxWidth: 'auto', height: '90%' }}
        >
            <div className={styles.wrapper}>
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
                        <p>{description}</p>
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
