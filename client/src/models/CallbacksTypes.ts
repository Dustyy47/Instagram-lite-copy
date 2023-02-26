import { ExtendedPostModel } from './PostModel'

export type ClickPostCallback = (data: ExtendedPostModel) => any
export type LikePostCallback = (_id: string) => any
export type AnyFunction = (...props: any[]) => any
export type ChooseEmojiCallback = (emojiText: string, e: React.MouseEvent) => any
