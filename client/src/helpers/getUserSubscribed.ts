export function getIsUserSubscribed(userSubscribes: string[], isGuest: boolean, profileId: string): boolean {
    if (isGuest || userSubscribes === null) {
        return false
    }
    return !!userSubscribes.find((subscribe) => subscribe === profileId)
}
