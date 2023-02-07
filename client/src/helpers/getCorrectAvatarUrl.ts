const PLACEHOLDER_FILENAME = 'placeholder.jpg'

/** Return correct url path for avatar with provided name, if name is undefined, return url of placeholder */
export function getCorrectAvatarUrl(avatarFileName?: string): string {
    if (!avatarFileName) avatarFileName = PLACEHOLDER_FILENAME
    return `${process.env.REACT_APP_API_URL}/avatars/${avatarFileName}`
}

export function getCorrectImageUrl(imageUrl: string): string {
    return `${process.env.REACT_APP_API_URL}/${imageUrl}`
}
