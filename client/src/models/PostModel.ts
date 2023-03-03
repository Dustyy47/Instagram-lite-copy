export interface PostModel {
    //likes: string[]
    // _id: string
    // imageUrl: string
    // title: string
    // description: string
    // postedBy: string
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
