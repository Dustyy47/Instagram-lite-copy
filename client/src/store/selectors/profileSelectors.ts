import { RootState } from './../index'
export const getFollowingsAndFollowers = (state: RootState) => ({
    usersListStatus: state.profile.usersListStatus,
    followers: state.profile.followers,
    followings: state.profile.followings,
})

export const getProfileInfo = (state: RootState) => state.profile.profileInfo
