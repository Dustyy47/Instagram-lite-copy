export const isPostLiked = (postId: string, likedPosts: string[]) => {
    if (!likedPosts) return false
    return likedPosts.indexOf(postId) !== -1
}
