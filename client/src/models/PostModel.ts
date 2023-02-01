export interface PostModel {
    likes: string[]
    _id: string
    imageUrl: string
    title: string
}

export interface ExtendedPostModel {
    postData: PostModel
    likesCountWithoutUser: number
    isActive: boolean
}
