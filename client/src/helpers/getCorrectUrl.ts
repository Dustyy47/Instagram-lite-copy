import { WithLikes } from 'models/Generics'
import { PostModel } from './../models/PostModel'
export const PLACEHOLDER_FILENAME = 'placeholder.jpg'

/** Return correct url path for avatar with provided name, if name is undefined, return url of placeholder */
export function getCorrectAvatarUrl(avatarFileName?: string): string {
    if (!avatarFileName) avatarFileName = PLACEHOLDER_FILENAME
    return `${process.env.REACT_APP_API_URL}/images/avatars/${avatarFileName}`
}

export function getCorrectImageUrl(imageUrl: string): string {
    return `${process.env.REACT_APP_API_URL}/images/${imageUrl}`
}

export function getPostsWithCorrectImage(posts: WithLikes<PostModel>[]) {
    return posts.map((postWithLikes) => ({
        ...postWithLikes,
        data: {
            ...postWithLikes.data,
            image_url: getCorrectImageUrl(postWithLikes.data.image_url),
        },
    }))
}
