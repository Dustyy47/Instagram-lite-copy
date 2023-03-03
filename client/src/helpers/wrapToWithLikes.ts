import { WithLikes, WithLikesData } from 'models/Generics'

export function wrapToWithLike<T extends WithLikesData>(data: T) {
    const newData: WithLikes<T> = { data: data, isLikedMe: false, numLikes: 0 }
    return newData
}
