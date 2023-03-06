export interface ProfileModel {
    owner: UserModel
    isUserProfile: boolean
    numFollowing: number
    numFollowers: number
}

export interface UserModel {
    userID: number
    nickname: string
    fullname: string
    avatarUrl: string
    isActiveUserFollowing?: boolean
}
