import { useSelector } from 'react-redux'
import { isPostLiked } from '../../helpers/isLikedPost'
import { ClickPostCallback, LikePostCallback } from '../../models/CallbacksTypes'
import { PostModel } from '../../models/PostModel'
import { Post } from './Post'
import styles from './PostsList.module.scss'

interface PostsListProps {
    onLike: LikePostCallback
    likedPosts: string[]
    onClickPost: ClickPostCallback
}

export function PostsList(props: PostsListProps) {
    const { onLike, likedPosts, onClickPost } = props
    const posts = useSelector((state: any) => state.profile.posts)

    function generatePost(post: PostModel) {
        if (!post) return null
        return (
            <Post
                onClick={onClickPost}
                isLiked={isPostLiked(post._id, likedPosts)}
                onLike={onLike}
                key={post?._id}
                data={post}
            />
        )
    }

    function generatePostRows(posts: PostModel[]) {
        let rows = []
        for (let i = 0; i < posts.length; i += 3) {
            let row = (
                <div className={styles.row}>
                    {[0, 1, 2].map((offset) => generatePost(posts[i + offset]))}
                </div>
            )
            rows.push(row)
        }
        return rows
    }

    return <div className={styles.wrapper}>{posts ? generatePostRows(posts) : 'Нет постов'}</div>
}
