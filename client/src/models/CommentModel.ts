import { UserItemModel } from 'models/ProfileOwnerModel'

export interface CommentModel {
    text: string
    id: number
    post_id: string
    user_id: string
    created_at: string
    //updatedAt: string
    author: UserItemModel
}

export interface CommentWithLikesModel {
    isLikedMe: boolean
    numLikes: number
    comment: CommentModel
}
