import { usePostLikes } from 'hooks/useLikes'
import { PostModel } from 'models/PostModel'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { fetchLikePost } from 'store/slices/userSlice'
import { LikeBtn } from '../UI/LikeBtn/LikeBtn'

interface PostLikeButtonProps {
    post: PostModel
    className?: string
}

export function PostLikeButton({ post, className }: PostLikeButtonProps) {
    const { likesCount, userLiked } = usePostLikes(post)
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const dispatch = useAppDispatch()

    function like(e: React.MouseEvent) {
        if (isGuest) return
        e.stopPropagation()
        dispatch(fetchLikePost(post._id))
    }
    return <LikeBtn isLiked={userLiked} onLike={like} likesCount={likesCount} className={className || ''} />
}
