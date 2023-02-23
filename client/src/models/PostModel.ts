export interface PostModel {
    likes: string[]
    _id: string
    imageUrl: string
    title: string
    description: string
    postedBy: string
}

export interface ExtendedPostModel {
    postData: Omit<PostModel, 'likes'>
    likesCountWithoutUser: number
    isActive: boolean
}
