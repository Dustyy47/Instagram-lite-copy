export const isPostLiked = (postId, likedPosts) => {
    if (!likedPosts) return false
    return likedPosts.indexOf(postId) !== -1
}
