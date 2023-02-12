import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { VscSmiley } from 'react-icons/vsc'
import { getCorrectImageUrl } from '../../helpers/getCorrectAvatarUrl'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import { useFormValidator, useValidator } from '../../hooks/validators'
import { getComments, sendComment } from '../../http/postsApi'
import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Status } from '../../models/LoadingStatus'
import { ExtendedPostModel } from '../../models/PostModel'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { useAppSelector } from '../../store/hooks'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Comments } from '../Comments/Comments'
import { Emojis } from '../Emojis/Emojis'
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

export const ExtendedPost = memo(function ExtendedPost({
    setActive,
    postInfo,
    authorInfo,
    onLike,
    isLiked,
}: ExtendedPostProps) {
    const { avatarUrl, nickName } = authorInfo
    const { postData, likesCountWithoutUser, isActive } = postInfo
    const { _id, title, description, imageUrl } = postData

    const isGuest = useAppSelector((state) => state.user.isGuest)

    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<CommentModel[]>([])
    const [commentsStatus, setCommentsStatus] = useState<Status>(Status.loading)
    const [areEmojisVisible, setEmojisVisible] = useState(false)

    const sendCommentValidator = useValidator([])

    const formValidator = useFormValidator(sendCommentValidator)

    const like = useCallback(
        (e: React.MouseEvent) => {
            if (isGuest) return
            onLike(_id)
        },
        [isGuest, _id, onLike]
    )

    const handleInputComment = useCallback(function (value: string) {
        setCommentText(value)
    }, [])

    const handleSendComment = useCallback(
        async function () {
            try {
                setCommentsStatus(() => Status.loading)
                const newComment = await sendComment(commentText, _id)
                if (newComment) setComments((prev) => [...prev, newComment])
                setCommentText('')
                formValidator.hideAll()

                setCommentsStatus(() => Status.idle)
            } catch (e) {
                setCommentsStatus(() => Status.error)
                console.log(e)
            }
        },
        [_id, commentText]
    )

    const emojisRef = useRef(null)
    useOutsideClick(emojisRef, closeEmojis)

    function closeEmojis() {
        setEmojisVisible(false)
    }

    function toggleEmojis() {
        console.log('toggled')

        setEmojisVisible((prev) => !prev)
    }

    function chooseEmoji(emoji: string) {
        setCommentText((prev) => prev + emoji)
        sendCommentValidator.validate(commentText + emoji)
    }

    function renderComments() {
        if (!comments || comments.length === 0) {
            return <h5>Нет комментариев :\ </h5>
        }
        if (commentsStatus === Status.loading) {
            return <Loading />
        }
        if (commentsStatus === Status.error) {
            return <h5>Ошибка, что-то пошло не так...</h5>
        }
        return <Comments onCommentAvatarClicked={() => setActive(false)} comments={comments} />
    }

    useEffect(() => {
        async function fetchGetComments() {
            if (!_id) return
            setComments([...(await getComments(_id))])
            setCommentsStatus(() => Status.idle)
        }
        setCommentsStatus(() => Status.loading)
        fetchGetComments()
    }, [_id])

    return (
        <Modal
            isActive={isActive}
            setActive={setActive}
            modalStyles={{ width: '70%', maxWidth: 'auto', aspectRatio: '1.55' }}
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
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <h3 className={styles.title}>{title}</h3>
                            <p>{description}</p>
                        </div>

                        {renderComments()}
                        {!isGuest && (
                            <form className={styles.sendForm}>
                                <div ref={emojisRef} className={styles.pickEmojiWrapper}>
                                    <Emojis
                                        className={styles.emojis}
                                        isClosed={!areEmojisVisible}
                                        onChoose={chooseEmoji}
                                    ></Emojis>
                                    <VscSmiley
                                        tabIndex={0}
                                        onClick={toggleEmojis}
                                        className={styles.emojisBtn}
                                    ></VscSmiley>
                                </div>
                                <Input
                                    isHiddenPermanently={true}
                                    isHiddenBeforeBlur={true}
                                    validator={sendCommentValidator}
                                    className={styles.commentInput}
                                    value={commentText}
                                    onChange={handleInputComment}
                                />
                                <Button
                                    className={styles.sendCommentBtn}
                                    onClick={handleSendComment}
                                    disabled={formValidator.hasErrors()}
                                >
                                    Отправить
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
})
