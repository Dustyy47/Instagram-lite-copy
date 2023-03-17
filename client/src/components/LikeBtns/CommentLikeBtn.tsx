import { useAppDispatch, useAppSelector } from 'store/hooks'
import { likesActions } from 'store/slices/likesSlice'
import { LikeBtn } from '../UI/LikeBtn/LikeBtn'
import styles from './CommentLikeBtn.module.scss'

interface PostLikeButtonProps {
    postID: number
    commentID: number
    className?: string
}

const classNames = {
    wrapper: styles.wrapper,
    icon: styles.icon,
    counter: styles.counter,
}

export function CommentLikeBtn({ commentID, postID }: PostLikeButtonProps) {
    const { isActiveUserLiked: isLikedMe, numLikes } = useAppSelector((state) => state.likes.likes['comment'][commentID]) || {}
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const dispatch = useAppDispatch()

    function like(e: React.MouseEvent) {
        if (isGuest) return
        e.stopPropagation()
        dispatch(likesActions.likeComment({ postID, commentID }))
    }
    return <LikeBtn isLikedMe={isLikedMe} onLike={like} numLikes={numLikes} classNames={classNames} />
}
