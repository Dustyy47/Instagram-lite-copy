export function getCorrectAvatarUrl(avatarUrl) {
    return `${process.env.REACT_APP_API_URL}/avatars/${avatarUrl}`
}
