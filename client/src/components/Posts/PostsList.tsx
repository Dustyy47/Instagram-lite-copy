import { WithLikes } from 'models/Generics'
import { PostModel } from 'models/PostModel'
import { memo } from 'react'
import { Post } from './Post'
import styles from './PostsList.module.scss'

interface PostsListProps {
    posts: WithLikes<PostModel>[]
}

export const PostsList = memo(function PostsList({ posts }: PostsListProps) {
    return (
        <div className={styles.wrapper}>
            {posts ? posts.map((post) => <Post key={post?.data.id} post={post} />) : 'Нет постов'}
        </div>
    )
})
