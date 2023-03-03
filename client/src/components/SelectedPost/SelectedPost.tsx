import { PostLikeButton } from 'components/PostLikeBtn/PostLikeBtn'
import { Back } from 'components/UI/Back'
import { useState } from 'react'
import { FaRegComment } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { extendedPostActions } from '../../store/slices/extendedPostSlice'
import { Modal } from '../Modal/Modal'
import styles from './SelectedPost.module.scss'
import { SelectedPostComments } from './SelectedPostComments'
import { SelectedPostContent } from './SelectedPostContent'
import { SelectedPostHeader } from './SelectedPostHeader'

export function SelectedPost() {
    const { isOpen, post: postWithLikes } = useAppSelector((state) => state.extendedPost)
    const post = postWithLikes?.data

    const dispatch = useAppDispatch()

    const [areCommentsOpen, setCommentsOpen] = useState(false)

    const isMobile = useMediaQuery({ query: '(max-width: 600px)' })

    function toggle(isOpen: boolean) {
        dispatch(extendedPostActions.toggle(isOpen))
    }

    function renderMobile() {
        if (!post) {
            return null
        }
        return (
            <Modal isActive={isOpen} setActive={toggle} className={styles.modal}>
                <>
                    <div className={styles.wrapper}>
                        <SelectedPostHeader>
                            <Back onClick={() => toggle(false)} className={styles.closeButton} />
                        </SelectedPostHeader>
                        <img className={styles.photo} src={post?.image_url} alt="" />
                        <SelectedPostContent>
                            <>
                                <PostLikeButton className={styles.likeBtn} postID={post.id} />
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
        if (!post) {
            return null
        }
        return (
            <Modal isActive={isOpen} setActive={toggle} className={styles.modal}>
                <div className={styles.wrapper}>
                    <img className={styles.photo} src={post.image_url} alt="" />
                    <div className={styles.info}>
                        <SelectedPostHeader>
                            <PostLikeButton className={styles.likeBtn} postID={post.id} />
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
