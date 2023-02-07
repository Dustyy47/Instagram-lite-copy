import { useEffect } from 'react'
import { getCorrectImageUrl } from '../../helpers/getCorrectAvatarUrl'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { AnyFunction } from '../../models/CallbacksTypes'
import { LoadingStatus } from '../../models/LoadingStatus'
import { ExtendedPostModel } from '../../models/PostModel'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { useAppDispatch } from '../../store/hooks'
import { extendedPostActions } from '../../store/slices/extendedPostSlice'
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

export function ExtendedPost(props: ExtendedPostProps) {
    const { setActive, postInfo, authorInfo, onLike, isLiked } = props
    const { commentText, comments, postLoadingStatus } = useCombinedSelector('extendedPost', [
        'commentText',
        'comments',
        'postLoadingStatus',
    ])

    const { avatarUrl, nickName } = authorInfo
    const { postData, likesCountWithoutUser, isActive } = postInfo
    const { _id, title, description, imageUrl } = postData

    const dispatch = useAppDispatch()
    const like = (e: React.MouseEvent) => {
        onLike(_id)
    }

    function handleInputComment(value: string) {
        dispatch(extendedPostActions.setCommentText(value))
    }

    function handleSendComment() {
        dispatch(extendedPostActions.fetchSendComment())
    }

    function renderComments() {
        if (!comments || comments.length === 0) {
            return <h5>Нет комментариев :\ </h5>
        }
        if (postLoadingStatus === LoadingStatus.loading) {
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
}
