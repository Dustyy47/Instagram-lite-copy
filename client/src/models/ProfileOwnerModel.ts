export interface ProfileOwnerModel {
    userID: number
    email: string
    nickname: string
    fullname: string
    avatarUrl: string
    numFollowing: number
    numFollowers: number
    isUserProfile: boolean
}

export type UserItemModel = Pick<ProfileOwnerModel, 'userID' | 'nickname' | 'avatarUrl' | 'fullname'>
