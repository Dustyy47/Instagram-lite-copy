import { useSelector } from 'react-redux'
import { isPostLiked } from '../../helpers/isLikedPost'
import { Post } from './Post'
import styles from './PostsList.module.scss'

export function PostsList({ onLike, likedPosts, onClickPost }) {
    const posts = useSelector((state) => state.profile.posts)

    return (
        <div className={styles.wrapper}>
            {posts
                ? posts.map((post) => (
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
}
