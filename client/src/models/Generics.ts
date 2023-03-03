export type WithLikesData = { id: number }

export interface WithLikes<T extends WithLikesData> {
    data: T
    numLikes: number
    isLikedMe: boolean
}
