import { ExtendedPostModel } from './PostModel'

export type ClickPostCallback = (data: ExtendedPostModel) => any
export type LikePostCallback = (_id: string) => any
