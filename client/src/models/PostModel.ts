export interface PostModel {
    created_at: string
    description: string
    id: number
    image_url: string
    title: string
    user_id: number
}

export interface ExtendedPostModel {
    postData: Omit<PostModel, 'likes'>
    likesCountWithoutUser: number
    isActive: boolean
}
