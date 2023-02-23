import { PostModel } from '../models/PostModel'
import { useAppSelector } from '../store/hooks'

export interface LikesMeta {
    likesCount: number
    userLiked: boolean
}

export function usePostLikes(post: Pick<PostModel, 'likes' | '_id'>): LikesMeta {
    const { likedPosts, userId } = useAppSelector((state) => state.user)
    const likesWithoutUser = post.likes.length - (!!post.likes.find((_id) => _id === userId) ? 1 : 0)
    const userLiked = !!likedPosts.find((_id) => _id === post._id)
    return {
        likesCount: likesWithoutUser + +userLiked,
        userLiked,
    }
}
