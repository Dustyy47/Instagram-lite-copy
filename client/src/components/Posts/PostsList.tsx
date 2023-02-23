import { memo } from 'react'
import { PostModel } from '../../models/PostModel'
import { Post } from './Post'
import styles from './PostsList.module.scss'

interface PostsListProps {
    posts: PostModel[]
}

export const PostsList = memo(function PostsList({ posts }: PostsListProps) {
    return (
        <div className={styles.wrapper}>
            {posts ? posts.map((post: PostModel) => <Post key={post?._id} data={post} />) : 'Нет постов'}
        </div>
    )
})
