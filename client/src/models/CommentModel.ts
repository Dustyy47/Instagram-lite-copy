import { UserModel } from 'models/ProfileOwnerModel'

export interface CommentModel {
    text: string
    id: number
    post_id: number
    user_id: number
    created_at: string
    //updatedAt: string
    author: UserModel
}

export interface CommentWithLikesModel {
    isLikedMe: boolean
    numLikes: number
    comment: CommentModel
}
