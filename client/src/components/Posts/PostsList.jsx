import { useSelector } from 'react-redux'
import { isPostLiked } from '../../utils/isLikedPost'
import { Post } from './Post'

export function PostsList({ onLike, likedPosts, onClickPost }) {
    const posts = useSelector((state) => state.profile.posts)

    return (
        <div className="page-content">
            {posts
                ? posts.map((post) => (
                      <Post
                          onClick={onClickPost}
                          isLiked={isPostLiked(post._id, likedPosts)}
                          onLike={onLike}
                          key={post._id}
                          data={post}
                      />
                  ))
                : 'Нет постов'}
        </div>
    )
}
