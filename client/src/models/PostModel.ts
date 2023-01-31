export interface PostModel {
    likes: string[]
    _id: number
    imageUrl: string
    title: string
}

export interface ExtendedPostModel {
    postData: PostModel
    likesCountWithoutUser: number
    isActive: boolean
}
