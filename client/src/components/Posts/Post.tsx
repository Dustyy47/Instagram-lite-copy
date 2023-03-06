import { PostLikeButton } from 'components/LikeBtns/PostLikeBtn'
import { useInitLikes } from 'hooks/useInitLikes'
import { WithLikes } from 'models/Generics'
import { useRef } from 'react'
import { PostModel } from '../../models/PostModel'
import { useAppDispatch } from '../../store/hooks'
import { extendedPostActions, fetchOpenPost } from '../../store/slices/extendedPostSlice'
import styles from './Post.module.scss'

interface PostProps {
    post: WithLikes<PostModel>
}

export function Post({ post }: PostProps) {
    const { image_url, title, id } = post.data
    const dispatch = useAppDispatch()
    useInitLikes<PostModel>(post, 'post')
    const loadingRef = useRef(true)

    function handleClick() {
        dispatch(extendedPostActions.reset())
        dispatch(fetchOpenPost(post))
    }

    return (
        <div className={styles.wrapper} onClick={handleClick}>
            <img
                src={image_url}
                alt="Post"
                className={`${styles.preview} ${loadingRef.current ? styles.loading : ''}`}
                onLoad={() => {
                    loadingRef.current = false
                }}
            />
            <div className={styles.info}>
                <h5 className={styles.title}>{title}</h5>
                <PostLikeButton className={styles.likes} postID={id} />
            </div>
        </div>
    )
}
