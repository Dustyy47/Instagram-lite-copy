import { PostModel } from './PostModel'
import { ProfileOwnerModel } from './ProfileOwnerModel'

export interface AxiosResponse {
    message: string
}

export interface FetchProfileReturn {
    profileOwnerInfo: ProfileOwnerModel
    posts: PostModel[]
}
