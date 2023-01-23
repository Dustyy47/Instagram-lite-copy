export function getIsUserSubscribed(userSubscribes, isGuest, profileId) {
    if (isGuest || userSubscribes === null) {
        return false
    }
    return !!userSubscribes.find((subscribe) => subscribe === profileId)
}
