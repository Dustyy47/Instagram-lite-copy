export function getCorrectAvatarUrl(avatarUrl: string): string {
    return `${process.env.REACT_APP_API_URL}/avatars/${avatarUrl}`
}

export function getCorrectImageUrl(imageUrl: string): string {
    return `${process.env.REACT_APP_API_URL}/${imageUrl}`
}
