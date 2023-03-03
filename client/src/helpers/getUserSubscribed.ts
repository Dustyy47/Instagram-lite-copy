export function getIsUserSubscribed(userSubscribes: number[], isGuest: boolean, profileId: number): boolean {
    if (isGuest || userSubscribes === null) {
        return false
    }
    return !!userSubscribes.find((subscribe) => subscribe === profileId)
}
