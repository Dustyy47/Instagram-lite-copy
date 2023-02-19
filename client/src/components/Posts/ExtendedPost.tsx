import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { FaRegComment } from 'react-icons/fa'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { MdOutlineArrowBack } from 'react-icons/md'
import { RiDeleteBin2Line, RiSendPlaneLine } from 'react-icons/ri'
import { useMediaQuery } from 'react-responsive'
import { useFormValidator, useValidator } from '../../hooks/validators'
import { getComments, sendComment } from '../../http/postsApi'
import { AnyFunction } from '../../models/CallbacksTypes'
import { CommentModel } from '../../models/CommentModel'
import { Status } from '../../models/LoadingStatus'
import { ExtendedPostModel } from '../../models/PostModel'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchDeletePost } from '../../store/slices/profileSlice'
import { Avatar } from '../Avatar/Avatar'
import { Button } from '../Button/Button'
import { Comments } from '../Comments/Comments'
import { DropDown, DropDownItem } from '../DropDown/DropDown'
import { EmojiPicker } from '../Emojis/PickEmoji'
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

    const dispatch = useAppDispatch()

    const isGuest = useAppSelector((state) => state.user.isGuest)
    const userNickName = useAppSelector((state) => state.user.nickName)
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' })
    const sendCommentValidator = useValidator([])
    const formValidator = useFormValidator(sendCommentValidator)

    const [commentText, setCommentText] = useState('')
    const [topOffset, setTopOffset] = useState('0')
    const [comments, setComments] = useState<CommentModel[]>([])
    const [menuItems, setMenuItems] = useState<DropDownItem[]>([])
    const [commentsStatus, setCommentsStatus] = useState<Status>(Status.loading)
    const [areCommentsOpen, setCommentsOpen] = useState(false)
    const [isMenuOpen, setMenuOpen] = useState(false)

    const like = useCallback(() => {
        if (isGuest) return
        onLike(_id)
    }, [isGuest, _id, onLike])

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

    const handleDeletePost = async () => {
        dispatch(fetchDeletePost(_id))
        setActive(false)
    }

    const defaultMenuItems: DropDownItem[] = useMemo(() => [], [])

    const ownerMenuItems: DropDownItem[] = [
        {
            key: 'delete',
            text: 'Удалить пост',
            icon: <RiDeleteBin2Line />,
            callback: handleDeletePost,
        },
    ]

    function isUserPost() {
        return nickName === userNickName
    }

    function handleClickMenu() {
        if (isMenuOpen) {
            setMenuItems([])
        } else {
            setMenuItems(isUserPost() ? ownerMenuItems : defaultMenuItems)
        }
        setMenuOpen((prev) => !prev)
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
        return <Comments onCommentAvatarClicked={() => setActive(false)} comments={comments} isMobile={isMobile} />
    }

    useEffect(() => {
        if (isMobile) {
            if (isActive) {
                document.body.classList.add(styles.fixed)
                setTopOffset(`${window.scrollY}px`)
            } else {
                document.body.classList.remove(styles.fixed)
            }
        }
        setMenuOpen(false)
    }, [isActive])

    useEffect(() => {
        async function fetchGetComments() {
            if (!_id) return
            setComments([...(await getComments(_id))])
            setCommentsStatus(() => Status.idle)
        }
        setCommentsStatus(() => Status.loading)
        fetchGetComments()
    }, [_id])

    if (isMobile) {
        return (
            <Modal
                style={{ top: topOffset }}
                isActive={isActive}
                closeByOutsideClick={false}
                setActive={setActive}
                className={styles.mobileModal}
            >
                <>
                    <div className={styles.wrapper}>
                        <div className={styles.header}>
                            <div className={styles.profileInfo}>
                                <Avatar url={avatarUrl || ''} className={styles.avatar} />
                                <p className={styles.nickName}>{nickName}</p>
                            </div>
                            <div className={styles.headerButtons}>
                                <button onClick={() => setActive(false)} className={styles.closeButton}>
                                    <MdOutlineArrowBack />
                                    Назад
                                </button>
                                <div className={styles.menuToggleWrapper}>
                                    <HiOutlineDotsVertical
                                        className={styles.menuToggleButton}
                                        onClick={handleClickMenu}
                                    />
                                    <DropDown
                                        className={styles.menu}
                                        setActive={setMenuOpen}
                                        items={menuItems}
                                        isActive={isMenuOpen}
                                    ></DropDown>
                                </div>
                            </div>
                        </div>
                        <div className={styles.photoWrapper}>
                            <img className={styles.photo} src={imageUrl} alt="" />
                        </div>
                        <div className={styles.bottomWrapper}>
                            <h3 className={styles.title}>{title}</h3>
                            <div className={styles.buttons}>
                                <FaRegComment onClick={() => setCommentsOpen(true)} className={styles.commentsButton} />
                                <LikeBtn
                                    isLiked={isLiked}
                                    onLike={like}
                                    likesCount={likesCountWithoutUser + +isLiked}
                                    className={styles.likeBtn}
                                />
                            </div>
                        </div>
                        <div>
                            <button>Развернуть описание</button>
                            <div className={styles.descriptionWrapper}>
                                <p className={styles.description}>{description}</p>
                            </div>
                        </div>
                    </div>
                    <Modal
                        className={styles.commentsModal}
                        isActive={areCommentsOpen}
                        setActive={setCommentsOpen}
                        shouldFixBody={false}
                    >
                        <>
                            <button onClick={() => setCommentsOpen(false)} className={styles.closeButton}>
                                <MdOutlineArrowBack />
                                Назад
                            </button>
                            {renderComments()}
                            <form className={styles.sendForm}>
                                <div className={styles.formLeftWrapper}>
                                    <Input
                                        isHiddenPermanently={true}
                                        isHiddenBeforeBlur={true}
                                        validator={sendCommentValidator}
                                        className={styles.commentInput}
                                        value={commentText}
                                        onChange={handleInputComment}
                                    />
                                    <EmojiPicker className={styles.emojiPicker} onChoose={chooseEmoji} />
                                </div>
                                <Button
                                    className={styles.sendCommentBtn}
                                    onClick={handleSendComment}
                                    disabled={formValidator.hasErrors()}
                                >
                                    <span className={styles.sendCommentBtnText}>Отправить</span>
                                    <RiSendPlaneLine className={styles.sendCommentBtnIcon} />
                                </Button>
                            </form>
                        </>
                    </Modal>
                </>
            </Modal>
        )
    }

    return (
        <Modal isActive={isActive} setActive={setActive} className={styles.modal}>
            <div className={styles.wrapper}>
                <img className={styles.photo} src={imageUrl} alt="" />
                <div className={styles.info}>
                    <div className={styles.header}>
                        <div className={styles.profileInfo}>
                            <Avatar url={avatarUrl || ''} />
                            <p className={styles.nickName}>{nickName}</p>
                        </div>
                        <div className={styles.headerButtons}>
                            <LikeBtn
                                isLiked={isLiked}
                                onLike={like}
                                likesCount={likesCountWithoutUser + +isLiked}
                                className={styles.likeBtn}
                            />
                            <div className={styles.menuToggleWrapper}>
                                <HiOutlineDotsVertical className={styles.menuToggleButton} onClick={handleClickMenu} />
                                <DropDown
                                    className={styles.menu}
                                    setActive={setMenuOpen}
                                    items={menuItems}
                                    isActive={isMenuOpen}
                                ></DropDown>
                            </div>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div className={styles.content}>
                            <h3 className={styles.title}>{title}</h3>
                            <p className={styles.description}>{description}</p>
                        </div>

                        {renderComments()}
                        {!isGuest && (
                            <form className={styles.sendForm}>
                                <div className={styles.formLeftWrapper}>
                                    <EmojiPicker className={styles.emojiPicker} onChoose={chooseEmoji} />
                                    <Input
                                        isHiddenPermanently={true}
                                        isHiddenBeforeBlur={true}
                                        validator={sendCommentValidator}
                                        className={styles.commentInput}
                                        value={commentText}
                                        onChange={handleInputComment}
                                    />
                                </div>
                                <Button
                                    className={styles.sendCommentBtn}
                                    onClick={handleSendComment}
                                    disabled={formValidator.hasErrors()}
                                >
                                    <span className={styles.sendCommentBtnText}>Отправить</span>
                                    <RiSendPlaneLine className={styles.sendCommentBtnIcon} />
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
})
