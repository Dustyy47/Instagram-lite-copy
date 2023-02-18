import { memo } from 'react'
import { isPostLiked } from '../../helpers/isLikedPost'
import { ClickPostCallback, LikePostCallback } from '../../models/CallbacksTypes'
import { PostModel } from '../../models/PostModel'
import { Post } from './Post'
import styles from './PostsList.module.scss'

interface PostsListProps {
    onLike: LikePostCallback
    likedPosts: string[]
    onClickPost: ClickPostCallback
    posts: PostModel[]
}

export const PostsList = memo(function PostsList({ onLike, likedPosts, onClickPost, posts }: PostsListProps) {
    return (
        <div className={styles.wrapper}>
            {posts
                ? posts.map((post: PostModel) => (
                      <Post
                          onClick={onClickPost}
                          isLiked={isPostLiked(post._id, likedPosts)}
                          onLike={onLike}
                          key={post?._id}
                          data={post}
                      />
                  ))
                : 'Нет постов'}
        </div>
    )
})
