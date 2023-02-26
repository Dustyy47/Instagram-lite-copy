import { CommentModel } from './CommentModel'
import { PostModel } from './PostModel'
import { ProfileOwnerModel } from './ProfileOwnerModel'

export interface AxiosResponse {
    message: string
}

//REQUESTS BODY

export interface RegistrationBody {
    email: string
    password: string
    fullname: string
    nickname: string
    avatarImage: File
}

//THUNKS
export interface FetchProfileReturn {
    profileOwnerInfo: ProfileOwnerModel
    posts: PostModel[]
}

export interface FetchLoadExtendedPostReturn {
    comments: CommentModel[]
    author: ProfileOwnerModel
}
