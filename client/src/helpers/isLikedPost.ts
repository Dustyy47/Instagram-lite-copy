export const isPostLiked = (postId: string, likedPosts: string[]) => {
    if (!likedPosts || likedPosts.length === 0) return false
    return likedPosts.indexOf(postId) !== -1
}
