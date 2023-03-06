import { CommentModel } from './CommentModel'
import { WithLikes } from './Generics'
import { PostModel } from './PostModel'
import { ProfileModel, UserModel } from './ProfileOwnerModel'

export interface AxiosResponse {
    message: string
    error: string
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
    profileOwnerInfo: ProfileModel
    posts: WithLikes<PostModel>[]
}

export interface FetchLoadExtendedPostReturn {
    comments: WithLikes<CommentModel>[]
    author: UserModel
}
