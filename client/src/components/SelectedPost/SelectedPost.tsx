import { PostLikeButton } from 'components/LikeBtns/PostLikeBtn'
import { Back } from 'components/UI/Back'
import { useState } from 'react'
import { FaRegComment } from 'react-icons/fa'
import { shallowEqual } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { getSelectedPostInitialInfo } from 'store/selectors/selectedPostSelectors'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { extendedPostActions } from '../../store/slices/extendedPostSlice'
import { Modal } from '../Modal/Modal'
import styles from './SelectedPost.module.scss'
import { SelectedPostComments } from './SelectedPostComments'
import { SelectedPostContent } from './SelectedPostContent'
import { SelectedPostHeader } from './SelectedPostHeader'

export function SelectedPost() {
    const { isOpen, post: postWithLikes } = useAppSelector(getSelectedPostInitialInfo, shallowEqual)
    const post = postWithLikes?.data
    const [areCommentsOpen, setCommentsOpen] = useState(false)

    const dispatch = useAppDispatch()
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

    function close() {
        dispatch(extendedPostActions.toggle(false))
    }

    function renderMobile() {
        return (
            <Modal isActive={isOpen} setActive={close} className={styles.modal}>
                <>
                    <div className={styles.wrapper}>
                        <SelectedPostHeader>
                            <Back onClick={() => close()} className={styles.closeButton} />
                        </SelectedPostHeader>
                        <img className={styles.photo} src={post?.image_url} alt="" />
                        <SelectedPostContent>
                            <>
                                <PostLikeButton className={styles.likeBtn} postID={post?.id || 0} />
                                <FaRegComment onClick={() => setCommentsOpen(true)} className={styles.commentsButton} />
                            </>
                        </SelectedPostContent>
                    </div>
                    <Modal
                        className={styles.commentsModal}
                        isActive={areCommentsOpen}
                        setActive={setCommentsOpen}
                        shouldFixBody={false}
                    >
                        <>
                            <Back onClick={() => setCommentsOpen(false)} className={styles.closeButton} />
                            <SelectedPostComments />
                        </>
                    </Modal>
                </>
            </Modal>
        )
    }

    function renderDesktop() {
        return (
            <Modal isActive={isOpen} setActive={close} className={styles.modal}>
                <div className={styles.wrapper}>
                    <img className={styles.photo} src={post?.image_url} alt="" />
                    <div className={styles.info}>
                        <SelectedPostHeader>
                            <PostLikeButton className={styles.likeBtn} postID={post?.id || 0} />
                        </SelectedPostHeader>
                        <div className={styles.container}>
                            <SelectedPostContent />
                            <SelectedPostComments />
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    return <>{isMobile ? renderMobile() : renderDesktop()}</>
}
