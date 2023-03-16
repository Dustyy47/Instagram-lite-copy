import { useAppDispatch, useAppSelector } from 'store/hooks'
import { likesActions } from 'store/slices/likesSlice'
import { LikeBtn } from '../UI/LikeBtn/LikeBtn'

interface PostLikeButtonProps {
    postID: number
    className?: string
}

export function PostLikeButton({ postID, className }: PostLikeButtonProps) {
    const { isActiveUserLiked: isLikedMe, numLikes } = useAppSelector((state) => state.likes.likes['post'][postID]) || {}
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const dispatch = useAppDispatch()

    function like(e: React.MouseEvent) {
        if (isGuest) return
        e.stopPropagation()
        dispatch(likesActions.likePost(postID))
    }
    return <LikeBtn isLikedMe={isLikedMe} onLike={like} numLikes={numLikes} classNames={{ wrapper: className || '' }} />
}
