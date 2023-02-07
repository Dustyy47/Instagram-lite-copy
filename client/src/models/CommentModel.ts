import { ProfileOwnerModel } from './ProfileOwnerModel'
export interface CommentModel {
    text: string
    author?: ProfileOwnerModel
    post?: string
    id?: string
    createdAt?: string
    updatedAt?: string
}
